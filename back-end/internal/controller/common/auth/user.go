package auth

import (
	"strings"

	"github.com/aws/aws-lambda-go/events"
)

// User は Cognito Authorizer によって認証されたユーザーを表す
type User struct {
	Email  string
	Groups []string
}

// FromRequest は API Gateway のリクエストコンテキストから認証済みユーザー情報を返す
func FromRequest(req events.APIGatewayProxyRequest) User {
	authorizer := req.RequestContext.Authorizer

	email, _ := authorizer["email"].(string)

	var groups []string
	if g, ok := authorizer["cognito:groups"].(string); ok && g != "" {
		groups = strings.Split(g, ",")
		for i := range groups {
			groups[i] = strings.TrimSpace(groups[i])
		}
	}

	return User{
		Email:  email,
		Groups: groups,
	}
}

// IsAdmin はユーザーが admin グループに属しているか判定する
func (u User) IsAdmin() bool {
	for _, g := range u.Groups {
		if g == "admin" {
			return true
		}
	}
	return false
}
