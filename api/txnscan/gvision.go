package txnscan

import (
	"context"
	"encoding/base64"

	vision "cloud.google.com/go/vision/apiv1"
	pb "google.golang.org/genproto/googleapis/cloud/vision/v1"
)

func NewGvision(ctx context.Context) (*Gvision, error) {
	client, err := vision.NewImageAnnotatorClient(ctx)
	if err != nil {
		return nil, err
	}

	gvision := &Gvision{visionClient: client}	

	return gvision, nil
}

func (gv *Gvision) ScanImage(ctx context.Context, base64Image string) (string, error) {
	imageBytes, err := base64.StdEncoding.DecodeString(base64Image)
  if err != nil {
    return "", err
  }

	image := &pb.Image{Content: imageBytes}

	texts, err := gv.visionClient.DetectTexts(ctx, image, nil, 1)
	if err != nil {
		return "", err
	}

	// The first item *seems to* contain all the detected text
	text := texts[0].Description
	
	return text, nil
}

func (gv *Gvision) Close() {
  gv.visionClient.Close()
}

type Gvision struct {
	visionClient *vision.ImageAnnotatorClient
}
