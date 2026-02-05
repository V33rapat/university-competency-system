package services

import (
	"context"
	"strconv"
	"time"

	"github.com/spw32767/university-competency-system-backend/repositories"
)

type CompetencyService struct {
	Repo *repositories.CompetencyRepository
}

func NewCompetencyService(repo *repositories.CompetencyRepository) *CompetencyService {
	return &CompetencyService{Repo: repo}
}

type Competency struct {
	ID     int64   `json:"id"`
	Code   string  `json:"code"`
	NameTH string  `json:"name_th"`
	NameEN *string `json:"name_en,omitempty"`
}

type Activity struct {
	ID           int64   `json:"id"`
	Title        string  `json:"title"`
	Date         string  `json:"date"`
	Year         string  `json:"year"`
	Month        int     `json:"month"`
	Score        float64 `json:"score"`
	MaxScore     float64 `json:"max_score"`
	Type         string  `json:"type"`
	Status       string  `json:"status"`
	CompetencyID int64   `json:"competency_id"`
}

type DashboardData struct {
	Competencies  []Competency         `json:"competencies"`
	Requirements  map[int64]float64    `json:"requirements"`
	Activities    map[int64][]Activity `json:"activities"`
	AvailableYear []string             `json:"available_years"`
}

func (s *CompetencyService) BuildDashboard(ctx context.Context, userID int64) (*DashboardData, error) {
	personID, err := s.Repo.ResolvePersonID(ctx, userID)
	if err != nil {
		return nil, err
	}

	competencies, err := s.Repo.GetCompetencies(ctx)
	if err != nil {
		return nil, err
	}

	curriculumID, err := s.Repo.GetCurrentCurriculumID(ctx, personID)
	if err != nil {
		return nil, err
	}

	requirements := map[int64]float64{}
	if curriculumID != 0 {
		requirements, err = s.Repo.GetRequirementsByCurriculum(ctx, curriculumID)
		if err != nil {
			return nil, err
		}
	}

	activityRows := []repositories.ActivityRecord{}
	if personID != 0 {
		activityRows, err = s.Repo.GetActivitiesByPerson(ctx, personID)
		if err != nil {
			return nil, err
		}
	}

	activitiesByCompetency := make(map[int64][]Activity)
	yearsSet := map[string]struct{}{}

	for _, row := range activityRows {
		date := ""
		year := ""
		month := 0
		if row.StartAt.Valid {
			t := row.StartAt.Time
			date = t.Format("02 Jan 2006")
			year = toAcademicYear(t)
			month = int(t.Month())
			yearsSet[year] = struct{}{}
		}

		status := "available"
		score := 0.0
		if row.EarnedPercent.Valid {
			status = "completed"
			score = row.EarnedPercent.Float64
		}

		actType := "Activity"
		if row.ActivityType != nil && *row.ActivityType != "" {
			actType = *row.ActivityType
		} else if row.ActivityCategory != nil && *row.ActivityCategory != "" {
			actType = *row.ActivityCategory
		}

		activitiesByCompetency[row.CompetencyID] = append(activitiesByCompetency[row.CompetencyID], Activity{
			ID:           row.SessionCompetencyID,
			Title:        row.ActivityName,
			Date:         date,
			Year:         year,
			Month:        month,
			Score:        score,
			MaxScore:     row.MaxPercent,
			Type:         actType,
			Status:       status,
			CompetencyID: row.CompetencyID,
		})
	}

	availableYears := make([]string, 0, len(yearsSet))
	for y := range yearsSet {
		availableYears = append(availableYears, y)
	}

	data := &DashboardData{
		Competencies:  make([]Competency, 0, len(competencies)),
		Requirements:  requirements,
		Activities:    activitiesByCompetency,
		AvailableYear: availableYears,
	}

	for _, comp := range competencies {
		data.Competencies = append(data.Competencies, Competency{
			ID:     comp.ID,
			Code:   comp.Code,
			NameTH: comp.NameTH,
			NameEN: comp.NameEN,
		})
	}

	return data, nil
}

func toAcademicYear(t time.Time) string {
	return strconv.Itoa(t.Year() + 543)
}
