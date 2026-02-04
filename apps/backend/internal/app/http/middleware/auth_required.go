package middleware

import (
	"net/http"
	"strings"

	"github.com/spw32767/university-competency-system-backend/internal/app/auth"
	"github.com/spw32767/university-competency-system-backend/pkg/response"
)

type AuthMiddleware struct {
	JWT auth.JWTManager
}

func (m AuthMiddleware) Required(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		h := r.Header.Get("Authorization")
		if h == "" || !strings.HasPrefix(h, "Bearer ") {
			response.Error(w, http.StatusUnauthorized, "AUTH_MISSING", "missing bearer token")
			return
		}
		tokenStr := strings.TrimSpace(strings.TrimPrefix(h, "Bearer "))

		claims, err := m.JWT.Verify(tokenStr)
		if err != nil {
			response.Error(w, http.StatusUnauthorized, "AUTH_INVALID", "invalid or expired token")
			return
		}

		ctx := auth.WithClaims(r.Context(), claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
