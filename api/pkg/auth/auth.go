package auth

import (
	"context"

	"m3o.dev/platform/service/auth"
	"m3o.dev/platform/service/errors"
)

const (
	CustomerNamespace = "micro"
)

// VerifyMicroCustomer returns the account from context if it belongs to a customer or an admin, error otherwise
func VerifyMicroCustomer(ctx context.Context, method string) (*auth.Account, error) {
	acc, ok := auth.AccountFromContext(ctx)
	if !ok {
		return nil, errors.Unauthorized(method, "Unauthorized")
	}
	if err := verifyMicroCustomer(acc, method); err != nil {
		// are they admin?
		if err := verifyMicroAdmin(acc, method); err == nil {
			return acc, nil
		}
		return nil, err
	}
	return acc, nil
}

func verifyMicroCustomer(acc *auth.Account, method string) error {
	errForbid := errors.Forbidden(method, "Forbidden")
	if acc.Issuer != CustomerNamespace {
		return errForbid
	}
	if acc.Type != "customer" {
		return errForbid
	}
	for _, s := range acc.Scopes {
		if s == "customer" {
			return nil
		}
	}
	return errForbid

}

// VerifyMicroAdmin returns the account from context if it belongs to an admin (or service), error otherwise
func VerifyMicroAdmin(ctx context.Context, method string) (*auth.Account, error) {
	acc, ok := auth.AccountFromContext(ctx)
	if !ok {
		return nil, errors.Unauthorized(method, "Unauthorized")
	}
	if err := verifyMicroAdmin(acc, method); err != nil {
		return nil, err
	}
	return acc, nil
}

func verifyMicroAdmin(acc *auth.Account, method string) error {
	errForbid := errors.Forbidden(method, "Forbidden")
	if acc.Issuer != CustomerNamespace {
		return errForbid
	}

	for _, s := range acc.Scopes {
		if (s == "admin" && acc.Type == "user") || (s == "service" && acc.Type == "service") {
			return nil
		}
	}
	return errForbid

}
