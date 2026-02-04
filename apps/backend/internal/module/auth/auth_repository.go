package authmod

import (
	"context"
	"database/sql"
)

type Repository struct {
	DB *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{DB: db}
}

// Load user by email and include roles (auth_roles.code)
func (r *Repository) GetUserWithRolesByEmail(ctx context.Context, email string) (*User, error) {
	// ปรับชื่อคอลัมน์ให้ตรงกับ schema ของคุณถ้าต่าง
	// ใช้ LEFT JOIN เผื่อบาง account ยังไม่ผูก role (แต่จริง ๆ ควรมี)
	q := `
SELECT 
	u.user_id,
	u.username,
	u.email,
	u.display_name,
	u.faculty_id,
	u.is_active,
	u.password_hash,
	r2.code AS role_code
FROM auth_users u
LEFT JOIN auth_user_roles ur ON ur.user_id = u.user_id
LEFT JOIN auth_roles r2 ON r2.role_id = ur.role_id
WHERE u.email = ?
`
	rows, err := r.DB.QueryContext(ctx, q, email)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out *User
	roleSet := map[string]bool{}

	for rows.Next() {
		var (
			userID     int64
			username   string
			emailVal   sql.NullString
			displayVal sql.NullString
			facultyVal sql.NullInt64
			isActive   bool
			passHash   string
			roleCode   sql.NullString
		)

		if err := rows.Scan(
			&userID, &username, &emailVal, &displayVal, &facultyVal, &isActive, &passHash, &roleCode,
		); err != nil {
			return nil, err
		}

		if out == nil {
			out = &User{
				UserID:       userID,
				Username:     username,
				IsActive:     isActive,
				PasswordHash: passHash,
				Roles:        []string{},
			}
			if emailVal.Valid {
				out.Email = &emailVal.String
			}
			if displayVal.Valid {
				out.DisplayName = &displayVal.String
			}
			if facultyVal.Valid {
				tmp := facultyVal.Int64
				out.FacultyID = &tmp
			}
		}

		if roleCode.Valid && roleCode.String != "" {
			roleSet[roleCode.String] = true
		}
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}
	if out == nil {
		return nil, sql.ErrNoRows
	}

	for k := range roleSet {
		out.Roles = append(out.Roles, k)
	}
	return out, nil
}

func (r *Repository) GetUserWithRolesByID(ctx context.Context, userID int64) (*User, error) {
	q := `
SELECT 
	u.user_id,
	u.username,
	u.email,
	u.display_name,
	u.faculty_id,
	u.is_active,
	u.password_hash,
	r2.code AS role_code
FROM auth_users u
LEFT JOIN auth_user_roles ur ON ur.user_id = u.user_id
LEFT JOIN auth_roles r2 ON r2.role_id = ur.role_id
WHERE u.user_id = ?
`
	rows, err := r.DB.QueryContext(ctx, q, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out *User
	roleSet := map[string]bool{}

	for rows.Next() {
		var (
			id         int64
			username   string
			emailVal   sql.NullString
			displayVal sql.NullString
			facultyVal sql.NullInt64
			isActive   bool
			passHash   string
			roleCode   sql.NullString
		)

		if err := rows.Scan(&id, &username, &emailVal, &displayVal, &facultyVal, &isActive, &passHash, &roleCode); err != nil {
			return nil, err
		}

		if out == nil {
			out = &User{
				UserID:       id,
				Username:     username,
				IsActive:     isActive,
				PasswordHash: passHash,
				Roles:        []string{},
			}
			if emailVal.Valid {
				out.Email = &emailVal.String
			}
			if displayVal.Valid {
				out.DisplayName = &displayVal.String
			}
			if facultyVal.Valid {
				tmp := facultyVal.Int64
				out.FacultyID = &tmp
			}
		}

		if roleCode.Valid && roleCode.String != "" {
			roleSet[roleCode.String] = true
		}
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}
	if out == nil {
		return nil, sql.ErrNoRows
	}

	for k := range roleSet {
		out.Roles = append(out.Roles, k)
	}
	return out, nil
}
