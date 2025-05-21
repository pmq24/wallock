package vault

import (
	drive "google.golang.org/api/drive/v3"
	"sync.wallock.xyz/auth"
)

type Service struct {
	drive *drive.Service
}

func NewService(accessToken string) (*Service, error) {
	driveService, err := auth.Authenticate(accessToken)
	if err != nil {
		return nil, err
	}

	return &Service{driveService}, nil
}

func (s *Service) Create(data createData) (*createResult, error) {
	folder := &drive.File{
		Name:     data.Name,
		MimeType: "application/vnd.google-apps.folder",
	}

	file, err := s.drive.Files.Create(folder).Do()
	if err != nil {
		return nil, err
	}

	return &createResult{Id: file.Id}, nil
}

type createData struct {
	Name string `json:"name"`
}
type createResult struct {
	Id string `json:"id"`
}
