package auth

import (
	"testing"

	"github.com/aws/aws-lambda-go/events"
)

func TestExtractClaims(t *testing.T) {
	req := events.APIGatewayProxyRequest{
		RequestContext: events.APIGatewayProxyRequestContext{
			Authorizer: map[string]interface{}{
				"email":          "test@example.com",
				"cognito:groups": "admin,member",
			},
		},
	}

	claims := ExtractClaims(req)

	if claims.Email != "test@example.com" {
		t.Errorf("expected email test@example.com, got %s", claims.Email)
	}
	if len(claims.Groups) != 2 {
		t.Errorf("expected 2 groups, got %d", len(claims.Groups))
	}
	if !claims.IsAdmin() {
		t.Error("expected IsAdmin() to return true")
	}
}

func TestExtractClaims_MemberOnly(t *testing.T) {
	req := events.APIGatewayProxyRequest{
		RequestContext: events.APIGatewayProxyRequestContext{
			Authorizer: map[string]interface{}{
				"email":          "member@example.com",
				"cognito:groups": "member",
			},
		},
	}

	claims := ExtractClaims(req)

	if claims.Email != "member@example.com" {
		t.Errorf("expected email member@example.com, got %s", claims.Email)
	}
	if claims.IsAdmin() {
		t.Error("expected IsAdmin() to return false")
	}
}

func TestExtractClaims_Empty(t *testing.T) {
	req := events.APIGatewayProxyRequest{
		RequestContext: events.APIGatewayProxyRequestContext{
			Authorizer: map[string]interface{}{},
		},
	}

	claims := ExtractClaims(req)

	if claims.Email != "" {
		t.Errorf("expected empty email, got %s", claims.Email)
	}
	if len(claims.Groups) != 0 {
		t.Errorf("expected 0 groups, got %d", len(claims.Groups))
	}
	if claims.IsAdmin() {
		t.Error("expected IsAdmin() to return false")
	}
}
