package handler

import (
	"net/http"

	"github.com/spw32767/university-competency-system-backend/pkg/response"
)

func Health(w http.ResponseWriter, r *http.Request) {
	response.OK(w, map[string]any{"status": "ok"})
}
