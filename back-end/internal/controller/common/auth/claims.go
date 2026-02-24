package auth

import (
	"strings"

	"github.com/aws/aws-lambda-go/events"
)

// UserClaims は API Gateway Cognito Authorizer から取得するユーザー情報
type UserClaims struct {
	Email  string
	Groups []string
}

// ExtractClaims は API Gateway のリクエストコンテキストからユーザー情報を取得する
func ExtractClaims(req events.APIGatewayProxyRequest) UserClaims {
	claims := req.RequestContext.Authorizer

	email, _ := claims["email"].(string)

	var groups []string
	if g, ok := claims["cognito:groups"].(string); ok && g != "" {
		groups = strings.Split(g, ",")
		for i := range groups {
			groups[i] = strings.TrimSpace(groups[i])
		}
	}

	return UserClaims{
		Email:  email,
		Groups: groups,
	}
}

// IsAdmin はユーザーが admin グループに属しているか判定する
func (c UserClaims) IsAdmin() bool {
	for _, g := range c.Groups {
		if g == "admin" {
			return true
		}
	}
	return false
}
