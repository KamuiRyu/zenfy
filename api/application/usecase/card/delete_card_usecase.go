package usecase

import (
	"fmt"

	"zenfy-api/domain/repository"
)

type DeleteCardUseCase struct {
	cardRepo repository.CardRepository
}

func NewDeleteCardUseCase(cardRepo repository.CardRepository) *DeleteCardUseCase {
	return &DeleteCardUseCase{
		cardRepo: cardRepo,
	}
}

func (uc *DeleteCardUseCase) Execute(userID, cardID int) error {
	card, err := uc.cardRepo.FindByID(cardID)
	if err != nil {
		return err
	}

	if card.UserID != userID {
		return fmt.Errorf("UNAUTHORIZED_ACTION")
	}

	return uc.cardRepo.Delete(cardID)
}
