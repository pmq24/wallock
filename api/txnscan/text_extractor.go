package txnscan

import (
	"context"
	"encoding/base64"
	"fmt"

	vision "cloud.google.com/go/vision/apiv1"
	pb "cloud.google.com/go/vision/v2/apiv1/visionpb"
)

type TextExtractor interface {
	ExtractText(ctx context.Context, imageBase64 string) (string, error)	
	Close()
}

type ErrCannotExtractText struct {
	Err error
}

func (e ErrCannotExtractText) Error() string {
	return fmt.Sprintf("Cannot extract text: %v", e.Err)
}

type GoogleVision struct {
	vision *vision.ImageAnnotatorClient
}

func NewGoogleVision(ctx context.Context) (*GoogleVision, error) {
	client, err := vision.NewImageAnnotatorClient(ctx)
	if err != nil {
		return nil, ErrCreateGoogleVision{Err: err}
	}

	gv := &GoogleVision{vision: client}	

	return gv, nil
}

type ErrCreateGoogleVision struct {
	Err error
}

func (e ErrCreateGoogleVision) Error() string {
	return fmt.Sprintf("Cannot create Google Vision: %v", e.Err)
}

func (gv *GoogleVision) ExtractText(ctx context.Context, base64Image string) (string, error) {
	imageBytes, err := base64.StdEncoding.DecodeString(base64Image)
  if err != nil {
    return "", ErrCannotExtractText{Err: err}
  }

	image := &pb.Image{Content: imageBytes}

	texts, err := gv.vision.DetectTexts(ctx, image, nil, 1)
	if err != nil {
		return "", ErrCannotExtractText{Err: err}
	}

	// The first item *seems to* contain all the detected text
	text := texts[0].Description
	
	return text, nil
}

func (gv *GoogleVision) Close() {
  gv.vision.Close()
}

