package auth

import (
	"encoding/json"
	"net/http"
	"os"

	"crypto/rand"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	drive "google.golang.org/api/drive/v3"

	_ "github.com/joho/godotenv/autoload"
)

func HandleAuthRequest(w http.ResponseWriter, r *http.Request) {
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

func HandleAuthCallback(w http.ResponseWriter, r *http.Request) {
	expectedState, err := r.Cookie(oauth2stateName)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	if expectedState.Value != r.FormValue("state") {
		w.WriteHeader(http.StatusBadRequest)
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
