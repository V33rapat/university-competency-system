package handler

import (
	"encoding/json"
	"net/http"

	"golang.org/x/crypto/bcrypt"

	"github.com/spw32767/university-competency-system-backend/internal/app/auth"
	"github.com/spw32767/university-competency-system-backend/pkg/response"
)

type AuthHandler struct {
	JWT auth.JWTManager
}

// demo user (เพื่อให้คุณลองระบบ auth ได้ทันที)
// email: admin@demo.local
// pass : Admin1234
var demoPasswordHash = mustHash("Admin1234")

func mustHash(pw string) []byte {
	h, _ := bcrypt.GenerateFromPassword([]byte(pw), bcrypt.DefaultCost)
	return h
}

type loginReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (h AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req loginReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "BAD_REQUEST", "invalid json")
		return
	}

	// demo auth check
	if req.Email != "admin@demo.local" {
		response.Error(w, http.StatusUnauthorized, "AUTH_INVALID", "invalid credentials")
		return
	}
	if err := bcrypt.CompareHashAndPassword(demoPasswordHash, []byte(req.Password)); err != nil {
		response.Error(w, http.StatusUnauthorized, "AUTH_INVALID", "invalid credentials")
		return
	}

	userID := int64(1)
	role := "admin"
	var facultyID *int64 = nil

	token, err := h.JWT.Generate(userID, role, facultyID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "TOKEN_ERROR", "could not generate token")
		return
	}

	response.OK(w, map[string]any{
		"access_token": token,
		"token_type":   "Bearer",
	})
}
