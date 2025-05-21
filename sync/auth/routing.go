package auth

import (
	"crypto/rand"
	"encoding/json"
	"net/http"
	"os"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	drive "google.golang.org/api/drive/v3"
)

func HandleAuthRoute(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		handleGetIndexRoute(w, r)
		return
	}

	w.WriteHeader(http.StatusMethodNotAllowed)
}

func HandleAuthCallbackRoute(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		handleGetCallbackRoute(w, r)
		return
	}

	w.WriteHeader(http.StatusMethodNotAllowed)
}

func handleGetIndexRoute(w http.ResponseWriter, r *http.Request) {
	state := rand.Text()
	cookie := http.Cookie{
		Name:     oauth2stateName,
		Value:    state,
		HttpOnly: true,
	}
	http.SetCookie(w, &cookie)

	redirectUri := r.FormValue("redirect_uri")
	config := createConfig(redirectUri)
	url := config.AuthCodeURL(state, oauth2.AccessTypeOnline, oauth2.S256ChallengeOption(verifier))
	http.Redirect(w, r, url, 301)
}

func handleGetCallbackRoute(w http.ResponseWriter, r *http.Request) {
	expectedState, err := r.Cookie(oauth2stateName)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("State mismatched"))
		return
	}
	if expectedState.Value != r.FormValue("state") {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("State mismatched"))
		return
	}

	config := createConfig(r.FormValue("redirect_uri"))

	token, err := config.Exchange(r.Context(), r.FormValue("code"), oauth2.VerifierOption(verifier))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	payload, err := json.Marshal(token)
	if err != nil {
		panic(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(payload)
}

func createConfig(redirectUri string) oauth2.Config {
	return oauth2.Config{
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		Scopes:       []string{drive.DriveFileScope},
		Endpoint:     google.Endpoint,
		RedirectURL:  redirectUri,
	}
}

var verifier = oauth2.GenerateVerifier()

const oauth2stateName = "oauth2state"
