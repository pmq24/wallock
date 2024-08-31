package auth

import (
	"crypto/rand"
	"encoding/hex"
	"os"

	"golang.org/x/oauth2"
)

func GenerateAuthURL() (url, state, codeVerifier string) {
	codeVerifier = oauth2.GenerateVerifier()

	randomBytes := make([]byte, 32)
	rand.Read(randomBytes)
	state = hex.EncodeToString(randomBytes)

	url = config.AuthCodeURL(state, oauth2.AccessTypeOnline, oauth2.S256ChallengeOption(codeVerifier))

	return
}

var config = &oauth2.Config{
	ClientID:     os.Getenv("GOOGLE_OAUTH2_CLIENT_ID"),
	ClientSecret: os.Getenv("GOOGLE_OAUTH2_CLIENT_SECRET"),
	Scopes:       []string{"https://www.googleapis.com/auth/drive.file"},
	RedirectURL:  os.Getenv("BASE_URL") + "/auth/google-callback",
	Endpoint: oauth2.Endpoint{
		AuthURL:  "https://accounts.google.com/o/oauth2/v2/auth",
		TokenURL: "https://accounts.google.com/o/oauth2/v2/token",
	},
}
