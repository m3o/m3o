package main

import (
	"database/sql"

	_ "github.com/jackc/pgx/v4/stdlib"
	"m3o.dev/platform/service"
	"m3o.dev/platform/service/config"
	"m3o.dev/platform/service/logger"
	"m3o.dev/services/db/handler"
	pb "m3o.dev/services/db/proto"
	admin "m3o.dev/services/pkg/service/proto"
	"m3o.dev/services/pkg/tracing"
)

var dbAddress = "postgresql://postgres:postgres@localhost:5432/db?sslmode=disable"

func main() {
	// Create service
	srv := service.New(
		service.Name("db"),
		service.Version("latest"),
	)

	// Connect to the database
	cfg, err := config.Get("db.address")
	if err != nil {
		logger.Fatalf("Error loading config: %v", err)
	}
	addr := cfg.String(dbAddress)
	sqlDB, err := sql.Open("pgx", addr)
	if err != nil {
		logger.Fatalf("Failed to open connection to DB %s", err)
	}
	h := &handler.Db{}
	h.DBConn(sqlDB)

	// Register handler
	pb.RegisterDbHandler(srv.Server(), h)
	admin.RegisterAdminHandler(srv.Server(), h)

	traceCloser := tracing.SetupOpentracing("db")
	defer traceCloser.Close()
	// Run service
	if err := srv.Run(); err != nil {
		logger.Fatal(err)
	}
}
