package auth

import (
	"testing"

	"github.com/aws/aws-lambda-go/events"
)

func TestFromRequest(t *testing.T) {
	req := events.APIGatewayProxyRequest{
		RequestContext: events.APIGatewayProxyRequestContext{
			Authorizer: map[string]interface{}{
				"email":          "test@example.com",
				"cognito:groups": "admin,member",
			},
		},
	}

	user := FromRequest(req)

	if user.Email != "test@example.com" {
		t.Errorf("expected email test@example.com, got %s", user.Email)
	}
	if len(user.Groups) != 2 {
		t.Errorf("expected 2 groups, got %d", len(user.Groups))
	}
	if !user.IsAdmin() {
		t.Error("expected IsAdmin() to return true")
	}
}

func TestFromRequest_MemberOnly(t *testing.T) {
	req := events.APIGatewayProxyRequest{
		RequestContext: events.APIGatewayProxyRequestContext{
			Authorizer: map[string]interface{}{
				"email":          "member@example.com",
				"cognito:groups": "member",
			},
		},
	}

	user := FromRequest(req)

	if user.Email != "member@example.com" {
		t.Errorf("expected email member@example.com, got %s", user.Email)
	}
	if user.IsAdmin() {
		t.Error("expected IsAdmin() to return false")
	}
}

func TestFromRequest_Unauthenticated(t *testing.T) {
	req := events.APIGatewayProxyRequest{
		RequestContext: events.APIGatewayProxyRequestContext{
			Authorizer: map[string]interface{}{},
		},
	}

	user := FromRequest(req)

	if user.Email != "" {
		t.Errorf("expected empty email, got %s", user.Email)
	}
	if len(user.Groups) != 0 {
		t.Errorf("expected 0 groups, got %d", len(user.Groups))
	}
	if user.IsAdmin() {
		t.Error("expected IsAdmin() to return false")
	}
}
