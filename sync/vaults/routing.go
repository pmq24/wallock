package vault

import (
	"encoding/json"
	"net/http"
)

func HandleVaultRoute(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		handleCreateRequest(w, r)
		return
	}

	w.WriteHeader(http.StatusMethodNotAllowed)
}

func handleCreateRequest(w http.ResponseWriter, r *http.Request) {
	accessToken := r.Context().Value("accessToken").(string)
	if accessToken == "" {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	service, err := NewService(accessToken)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	var payload createData
	err = json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	result, err := service.Create(payload)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	var resPayload string
	json.NewEncoder(w).Encode(&result)
	w.Write([]byte(resPayload))
	w.WriteHeader(http.StatusCreated)
}
