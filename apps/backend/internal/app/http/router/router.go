package router

import (
	"database/sql"
	"net/http"

	"github.com/go-chi/chi/v5"

	"github.com/spw32767/university-competency-system-backend/internal/app/auth"
	"github.com/spw32767/university-competency-system-backend/internal/app/config"
	"github.com/spw32767/university-competency-system-backend/internal/app/http/handler"
	"github.com/spw32767/university-competency-system-backend/internal/app/http/middleware"
)

func New(db *sql.DB, cfg config.Config) http.Handler {
	r := chi.NewRouter()

	// middlewares
	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.CORS)

	// health
	r.Get("/health", handler.Health)

	jwtMgr := auth.JWTManager{
		Secret:        []byte(cfg.JWTSecret),
		Issuer:        cfg.JWTIssuer,
		ExpireMinutes: cfg.JWTExpireMinutes,
	}

	authMW := middleware.AuthMiddleware{JWT: jwtMgr}
	authHandler := handler.AuthHandler{JWT: jwtMgr}

	r.Route("/api/v1", func(api chi.Router) {
		// public
		api.Post("/auth/login", authHandler.Login)

		// protected example
		api.Group(func(pr chi.Router) {
			pr.Use(authMW.Required)

			// admin-only example endpoint
			pr.With(middleware.RequireRoles("admin")).Get("/admin/ping", func(w http.ResponseWriter, r *http.Request) {
				w.Write([]byte("admin pong"))
			})

			// officer/admin example
			pr.With(middleware.RequireRoles("admin", "officer")).Get("/officer/ping", func(w http.ResponseWriter, r *http.Request) {
				w.Write([]byte("officer pong"))
			})
		})
	})

	_ = db // ยังไม่ได้ใช้ใน base นี้
	return r
}
