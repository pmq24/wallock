package txnscan

import (
	"encoding/json"
	"log"
	"net/http"
)

func scan(res http.ResponseWriter, req *http.Request) {
	payload, err := extractScanPayload(req)
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(err.Error()))
		return
	}

	gvision, err := NewGvision(req.Context())
	if err != nil {
		res.WriteHeader(http.StatusInternalServerError)
		log.Println(string(err.Error()))
		return
	}
	defer gvision.Close()

	text, err := gvision.ScanImage(req.Context(), payload.ImageBase64)
	if err != nil {
		res.WriteHeader(http.StatusInternalServerError)
		log.Println(string(err.Error()))
		return
	}

	res.WriteHeader(http.StatusOK)
  res.Write([]byte(text))
}

type scanPayload struct {
	ImageBase64 string `json:"imageBase64"`
	Categories []string `json:"categories"`
	Wallets []string `json:"wallets"`
}

func extractScanPayload(req *http.Request) (*scanPayload, error) {
	var payload scanPayload
  decoder := json.NewDecoder(req.Body)
  err := decoder.Decode(&payload)

  if err != nil {
		return nil, err
  }

	return &payload, nil
}
