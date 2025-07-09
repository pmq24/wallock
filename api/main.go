package main

import (
	"log"
	"net/http"

	"wallock.xyz/txnscan"
)

func main() {
	api := http.NewServeMux()

	txnscanRouter := txnscan.NewRouter()
	api.Handle("/transaction-scans/", http.StripPrefix("/transaction-scans", txnscanRouter.Router))

	r := http.NewServeMux()
	r.Handle("/api/", http.StripPrefix("/api", api))

	log.Println("Starting server on port 3000")
	server := http.Server{
		Addr:    ":3000",
		Handler: reqLogMiddleware(r),
	}
	server.ListenAndServe()

	txnscanRouter.Close()
}

func reqLogMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(res http.ResponseWriter, req *http.Request) {
		log.Printf("%-7s %s", req.Method, req.URL.Path)
		next.ServeHTTP(res, req)
	})
}
