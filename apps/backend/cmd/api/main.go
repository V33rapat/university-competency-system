package main

import (
	"log"
	"net/http"

	"github.com/joho/godotenv"

	"github.com/spw32767/university-competency-system-backend/internal/app/config"
	appdb "github.com/spw32767/university-competency-system-backend/internal/app/db"
	"github.com/spw32767/university-competency-system-backend/internal/app/http/router"
)

func main() {
	_ = godotenv.Load()

	cfg := config.Load()

	db, err := appdb.NewMySQL(cfg)
	if err != nil {
		log.Fatalf("db connect failed: %v", err)
	}
	defer db.Close()

	r := router.New(db, cfg)

	log.Printf("API listening on %s", cfg.HTTPAddr)
	if err := http.ListenAndServe(cfg.HTTPAddr, r); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
