package main

import (
	"net/http"
	"os"

	_ "github.com/joho/godotenv/autoload"
	"github.com/rs/cors"
	"sync.wallock.xyz/auth"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/auth", auth.HandleAuthRequest)
	mux.HandleFunc("/auth-callback", auth.HandleAuthCallback)

	handler := cors.New(cors.Options{
		AllowedOrigins:   []string{os.Getenv("WEB_APP_BASE_URL")},
		AllowCredentials: true,
	}).Handler(mux)

	http.ListenAndServe(":3200", handler)
}
