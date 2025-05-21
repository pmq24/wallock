package auth

import (
	"context"
	"net/http"
	"strings"

	"golang.org/x/oauth2"
	"google.golang.org/api/drive/v3"
	"google.golang.org/api/option"
)

func AccessTokenAttachmentHandler(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		accessToken := strings.TrimPrefix(authHeader, "Bearer ")

		ctx := context.WithValue(r.Context(), "accessToken", accessToken)
		handler.ServeHTTP(w, r.WithContext(ctx))
	})
}

func Authenticate(accessToken string) (service *drive.Service, err error) {
	ctx := context.Background()

	token := option.WithTokenSource(oauth2.StaticTokenSource(&oauth2.Token{AccessToken: accessToken}))

	service, err = drive.NewService(ctx, token)
	return service, err
}
