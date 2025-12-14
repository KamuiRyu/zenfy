package database

import (
	"fmt"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/lib/pq"

	"zenfy-api/config"
)

func RunMigrations(migrationsPath string) error {
	cfg := config.Cfg
	if cfg == nil {
		return fmt.Errorf("config.Cfg is nil; call config.Load before RunMigrations")
	}

	host := cfg.DBHost
	port := cfg.DBPort
	user := cfg.DBUser
	password := cfg.DBPassword
	dbname := cfg.DBName

	dbURL := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", user, password, host, port, dbname)
	sourceURL := "file://" + migrationsPath

	m, err := migrate.New(sourceURL, dbURL)
	if err != nil {
		return err
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		return err
	}
	return nil
}
