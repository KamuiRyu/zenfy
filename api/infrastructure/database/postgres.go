package database

import (
	"database/sql"
	"fmt"
	"sync"

	_ "github.com/lib/pq"

	"zenfy-api/config"
)

var (
	instance *sql.DB
	once     sync.Once
)

func NewPostgresConnection() (*sql.DB, error) {
	var err error
	once.Do(func() {
		cfg := config.Cfg
		if cfg == nil {
			err = fmt.Errorf("config.Cfg is nil; call config.Load before NewPostgresConnection")
			return
		}

		host := cfg.DBHost
		port := cfg.DBPort
		user := cfg.DBUser
		password := cfg.DBPassword
		dbname := cfg.DBName

		connStr := fmt.Sprintf(
			"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
			host, port, user, password, dbname,
		)

		instance, err = sql.Open("postgres", connStr)
		if err != nil {
			return
		}

		if err = instance.Ping(); err != nil {
			_ = instance.Close()
			instance = nil
			return
		}
	})

	if instance == nil && err == nil {
		return nil, fmt.Errorf("failed to initialize database connection")
	}
	return instance, err
}

func CloseConnection() error {
	if instance != nil {
		err := instance.Close()
		instance = nil
		return err
	}
	return nil
}
