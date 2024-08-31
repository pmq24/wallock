package auth

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
)

func SetUpRoutes(router *mux.Router) {
	router.HandleFunc("/google", func(writer http.ResponseWriter, req *http.Request) {
		url, state, codeVerifier := GenerateAuthURL()

		session, _ := sessionStore.Get(req, "oauth2Session")

		fmt.Println(url)
		fmt.Println(state)
		fmt.Println(codeVerifier)

		session.Values["codeVerifier"] = codeVerifier
		session.Values["state"] = state

		if err := session.Save(req, writer); err != nil {
			http.Error(writer, err.Error(), http.StatusInternalServerError)
		} else {
			http.Redirect(writer, req, url, http.StatusTemporaryRedirect)
		}
	})

}

var sessionStore = sessions.NewCookieStore([]byte(os.Getenv("SESSION_KEY")))
