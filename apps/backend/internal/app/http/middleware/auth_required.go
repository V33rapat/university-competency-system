package middleware

import (
	"net/http"
	"os"
	"strings"

	"github.com/spw32767/university-competency-system-backend/internal/app/auth"
	"github.com/spw32767/university-competency-system-backend/pkg/response"
)

type AuthMiddleware struct {
	JWT auth.JWTManager
}

func cookieName() string {
	if v := os.Getenv("COOKIE_NAME"); v != "" {
		return v
	}
	return "ucs_token"
}

func (m AuthMiddleware) Required(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var tokenStr string

		// 1) cookie
		if c, err := r.Cookie(cookieName()); err == nil && c.Value != "" {
			tokenStr = c.Value
		}

		// 2) bearer header fallback (useful for Postman)
		if tokenStr == "" {
			h := r.Header.Get("Authorization")
			if h != "" && strings.HasPrefix(h, "Bearer ") {
				tokenStr = strings.TrimSpace(strings.TrimPrefix(h, "Bearer "))
			}
		}

		if tokenStr == "" {
			response.Error(w, http.StatusUnauthorized, "AUTH_MISSING", "missing token")
			return
		}

		claims, err := m.JWT.Verify(tokenStr)
		if err != nil {
			response.Error(w, http.StatusUnauthorized, "AUTH_INVALID", "invalid or expired token")
			return
		}

		ctx := auth.WithClaims(r.Context(), claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
