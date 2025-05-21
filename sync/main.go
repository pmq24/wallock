package main

import (
	"net/http"
	"os"

	_ "github.com/joho/godotenv/autoload"
	"github.com/rs/cors"

	"sync.wallock.xyz/auth"
	"sync.wallock.xyz/vaults"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/auth", auth.HandleAuthRoute)
	mux.HandleFunc("/auth/callback", auth.HandleAuthCallbackRoute)

	mux.HandleFunc("/vaults", vault.HandleVaultsRoute)
	mux.HandleFunc("/vaults/{id}", vault.HandleVaultRoute)

	handler := auth.AccessTokenAttachmentHandler(mux)

	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{os.Getenv("WEB_APP_BASE_URL")},
		AllowedMethods:   []string{http.MethodGet, http.MethodPost, http.MethodPatch, http.MethodDelete},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})
	handler = corsHandler.Handler(handler)

	http.ListenAndServe(":3200", handler)
}
