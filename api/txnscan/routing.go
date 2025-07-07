package txnscan

import (
	"net/http"
)

func NewRouter() *http.ServeMux {
	r := http.NewServeMux()

	r.HandleFunc("POST /", scan)

	return r
}
