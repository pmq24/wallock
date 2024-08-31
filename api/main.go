package main

import (
	"net/http"

	"github.com/gorilla/mux"

	auth "main/auth"
)

func main() {
	router := mux.NewRouter()

	auth.SetUpRoutes(router.PathPrefix("/auth").Subrouter())

	http.ListenAndServe(":3000", router)
}
