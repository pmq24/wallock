package txnscan

import (
	"context"
	"fmt"
	"strings"
)

type ScanService struct {
	textExtractor TextExtractor
	txnGuesser TxnGuesser
}

func NewScanService() *ScanService {
	ctx := context.Background()

	textExtractor, err := NewGoogleVision(ctx)
  if err != nil {
    panic(err)
  }

	txnGuesser, err := NewGoogleGemini(ctx)
	if err != nil {
		panic(err)
	}

	return &ScanService{
    textExtractor: textExtractor,
    txnGuesser: txnGuesser,
  }
}

var ErrInvalidImage = fmt.Errorf("invalid image")

type ScanInput struct {
	ImageBase64 string `json:"imageBase64"`
	Categories []string `json:"categories"`
	Wallets []string `json:"wallets"`
}

type ScanOutput = GuessOutput

func (s *ScanService) Scan(ctx context.Context, payload *ScanInput) (*ScanOutput, error) {
	imageBase64 := strings.TrimSpace(payload.ImageBase64)

	if len(imageBase64) == 0 {
    return nil, ErrInvalidImage
  }

	text, err := s.textExtractor.ExtractText(ctx, imageBase64)
	if err != nil {
		return nil, err
	}

	guess, err := s.txnGuesser.GuessTxn(ctx, text, payload.Categories, payload.Wallets)
	if err != nil {
		return nil, err
	}

	return &guess, nil
}

func (s *ScanService) Close() {
  s.textExtractor.Close()
}
