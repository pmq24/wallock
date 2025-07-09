package txnscan

import (
	"encoding/json"
	"net/http"
)

type TxnScanRouter struct {
	Router *http.ServeMux
	scanService *ScanService
}

func NewTxnScanRouter() *TxnScanRouter {
	router := http.NewServeMux()
	scanService := NewScanService()

	r := TxnScanRouter{
    Router: router,
    scanService: scanService,
  }

	r.Router.HandleFunc("POST /", func(res http.ResponseWriter, req *http.Request) {
		var reqPayload ScanInput
		err := json.NewDecoder(req.Body).Decode(&reqPayload)
		if err != nil {
			res.WriteHeader(http.StatusBadRequest)
			res.Write([]byte(err.Error()))
			return
		}

		scanOutput, err := scanService.Scan(req.Context(), &reqPayload)
    if err != nil {
      res.WriteHeader(http.StatusBadRequest)
      res.Write([]byte(err.Error()))
			return
    }

		resPayload, err := json.Marshal(scanOutput)
    if err != nil {
      res.WriteHeader(http.StatusInternalServerError)
      res.Write([]byte(err.Error()))
			return
    }

		res.WriteHeader(http.StatusOK)	
		res.Write(resPayload)
	})

	return &r
}

func (r *TxnScanRouter) Close() {
  r.scanService.Close()
}
