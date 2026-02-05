package controllers

import (
	"net/http"

	"github.com/spw32767/university-competency-system-backend/services"
	"github.com/spw32767/university-competency-system-backend/utils"
)

type CompetencyController struct {
	Service *services.CompetencyService
}

func (h *CompetencyController) Dashboard(w http.ResponseWriter, r *http.Request) {
	claims, ok := utils.ClaimsFromContext(r.Context())
	if !ok {
		utils.Error(w, http.StatusUnauthorized, "AUTH_MISSING", "missing auth")
		return
	}

	data, err := h.Service.BuildDashboard(r.Context(), claims.UserID)
	if err != nil {
		utils.Error(w, http.StatusInternalServerError, "SERVER_ERROR", "could not load competency data")
		return
	}

	utils.OK(w, data)
}
