package usecase

import (
	"fmt"
	"strconv"

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

func (uc *DeleteCardUseCase) Execute(userID int, cardUUID string) error {
	card, err := uc.cardRepo.FindByUUID(cardUUID)
	if err != nil {
		if idInt, perr := strconv.Atoi(cardUUID); perr == nil {
			card, err = uc.cardRepo.FindByID(idInt)
		}
		if err != nil {
			return err
		}
		// if found by numeric id, delete by numeric id
		if card.UserID != userID {
			return fmt.Errorf("UNAUTHORIZED_ACTION")
		}
		return uc.cardRepo.Delete(card.ID)
	}

	if card.UserID != userID {
		return fmt.Errorf("UNAUTHORIZED_ACTION")
	}

	return uc.cardRepo.DeleteByUUID(cardUUID)
}
