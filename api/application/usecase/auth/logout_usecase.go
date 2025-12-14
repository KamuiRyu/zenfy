package usecase

import (
	"database/sql"

	"zenfy-api/domain/repository"
)

type LogoutUseCase struct {
	refreshRepo repository.RefreshTokenRepository
}

func NewLogoutUseCase(refreshRepo repository.RefreshTokenRepository) *LogoutUseCase {
	return &LogoutUseCase{refreshRepo: refreshRepo}
}

func (uc *LogoutUseCase) Execute(token string) error {
	if uc.refreshRepo == nil || token == "" {
		return nil
	}
	_, err := uc.refreshRepo.Consume(token)
	if err != nil && err != sql.ErrNoRows {
		return err
	}
	return nil
}
