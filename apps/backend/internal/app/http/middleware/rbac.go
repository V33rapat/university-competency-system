package middleware

import (
	"net/http"

	"github.com/spw32767/university-competency-system-backend/internal/app/auth"
	"github.com/spw32767/university-competency-system-backend/pkg/response"
)

func RequireRoles(roles ...string) func(http.Handler) http.Handler {
	allowed := map[string]bool{}
	for _, r := range roles {
		allowed[r] = true
	}

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			claims, ok := auth.ClaimsFromContext(r.Context())
			if !ok {
				response.Error(w, http.StatusUnauthorized, "AUTH_MISSING", "missing auth context")
				return
			}
			if !allowed[claims.Role] {
				response.Error(w, http.StatusForbidden, "FORBIDDEN", "insufficient role")
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
