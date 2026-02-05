package repositories

import (
	"context"
	"database/sql"
)

type CompetencyRepository struct {
	DB *sql.DB
}

func NewCompetencyRepository(db *sql.DB) *CompetencyRepository {
	return &CompetencyRepository{DB: db}
}

type CompetencyRecord struct {
	ID     int64
	Code   string
	NameTH string
	NameEN *string
}

type ActivityRecord struct {
	SessionCompetencyID int64
	CompetencyID        int64
	CompetencyCode      string
	ActivityID          int64
	ActivityName        string
	ActivityCategory    *string
	ActivityType        *string
	SessionStatus       string
	StartAt             sql.NullTime
	MaxPercent          float64
	EarnedPercent       sql.NullFloat64
}

func (r *CompetencyRepository) ResolvePersonID(ctx context.Context, userID int64) (int64, error) {
	var personID sql.NullInt64
	if err := r.DB.QueryRowContext(ctx, `SELECT person_id FROM auth_users WHERE user_id = ?`, userID).Scan(&personID); err != nil {
		return 0, err
	}
	if personID.Valid {
		return personID.Int64, nil
	}

	var exists int
	if err := r.DB.QueryRowContext(ctx, `SELECT 1 FROM persons WHERE person_id = ?`, userID).Scan(&exists); err != nil {
		if err == sql.ErrNoRows {
			return 0, nil
		}
		return 0, err
	}
	return userID, nil
}

func (r *CompetencyRepository) GetCurrentCurriculumID(ctx context.Context, personID int64) (int64, error) {
	var curriculumID int64
	err := r.DB.QueryRowContext(ctx, `
SELECT ec.curriculum_id
FROM kku_enrollments e
JOIN kku_enrollment_curricula ec ON ec.enrollment_id = e.enrollment_id
WHERE e.person_id = ?
  AND e.deleted_at IS NULL
  AND ec.deleted_at IS NULL
  AND ec.is_current = 1
LIMIT 1
`, personID).Scan(&curriculumID)
	if err != nil {
		if err == sql.ErrNoRows {
			return 0, nil
		}
		return 0, err
	}
	return curriculumID, nil
}

func (r *CompetencyRepository) GetCompetencies(ctx context.Context) ([]CompetencyRecord, error) {
	rows, err := r.DB.QueryContext(ctx, `
SELECT competency_id, code, name_th, name_en
FROM comp_competencies
WHERE is_active = 1 AND deleted_at IS NULL
ORDER BY competency_id
`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []CompetencyRecord
	for rows.Next() {
		var rec CompetencyRecord
		var nameEN sql.NullString
		if err := rows.Scan(&rec.ID, &rec.Code, &rec.NameTH, &nameEN); err != nil {
			return nil, err
		}
		if nameEN.Valid {
			rec.NameEN = &nameEN.String
		}
		items = append(items, rec)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

func (r *CompetencyRepository) GetRequirementsByCurriculum(ctx context.Context, curriculumID int64) (map[int64]float64, error) {
	rows, err := r.DB.QueryContext(ctx, `
SELECT competency_id, target_percent
FROM comp_curriculum_requirements
WHERE curriculum_id = ? AND deleted_at IS NULL
`, curriculumID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	requirements := make(map[int64]float64)
	for rows.Next() {
		var competencyID int64
		var target float64
		if err := rows.Scan(&competencyID, &target); err != nil {
			return nil, err
		}
		requirements[competencyID] = target
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return requirements, nil
}

func (r *CompetencyRepository) GetActivitiesByPerson(ctx context.Context, personID int64) ([]ActivityRecord, error) {
	rows, err := r.DB.QueryContext(ctx, `
SELECT
  sc.session_competency_id,
  sc.competency_id,
  c.code,
  a.activity_id,
  a.name_th,
  a.category,
  a.type,
  s.status,
  s.start_at,
  sc.max_percent,
  csr.earned_percent
FROM act_session_competencies sc
JOIN comp_competencies c ON c.competency_id = sc.competency_id AND c.deleted_at IS NULL
JOIN act_sessions s ON s.session_id = sc.session_id AND s.deleted_at IS NULL
JOIN act_activities a ON a.activity_id = s.activity_id AND a.deleted_at IS NULL
LEFT JOIN score_session_competency_scores scc
  ON scc.session_competency_id = sc.session_competency_id
  AND scc.person_id = ?
  AND scc.deleted_at IS NULL
LEFT JOIN score_session_competency_results csr
  ON csr.score_id = scc.session_competency_score_id
  AND csr.deleted_at IS NULL
WHERE sc.deleted_at IS NULL
ORDER BY s.start_at DESC
`, personID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []ActivityRecord
	for rows.Next() {
		var rec ActivityRecord
		var category sql.NullString
		var actType sql.NullString
		if err := rows.Scan(
			&rec.SessionCompetencyID,
			&rec.CompetencyID,
			&rec.CompetencyCode,
			&rec.ActivityID,
			&rec.ActivityName,
			&category,
			&actType,
			&rec.SessionStatus,
			&rec.StartAt,
			&rec.MaxPercent,
			&rec.EarnedPercent,
		); err != nil {
			return nil, err
		}
		if category.Valid {
			rec.ActivityCategory = &category.String
		}
		if actType.Valid {
			rec.ActivityType = &actType.String
		}
		items = append(items, rec)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}
