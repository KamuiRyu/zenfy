package usecase

import (
	"fmt"
	"strconv"

	"zenfy-api/domain/repository"
)

type SetDefaultCardUseCase struct {
	cardRepo repository.CardRepository
}

func NewSetDefaultCardUseCase(cardRepo repository.CardRepository) *SetDefaultCardUseCase {
	return &SetDefaultCardUseCase{
		cardRepo: cardRepo,
	}
}

func (uc *SetDefaultCardUseCase) Execute(userID int, cardUUID string) error {
	card, err := uc.cardRepo.FindByUUID(cardUUID)
	if err != nil {
		if idInt, perr := strconv.Atoi(cardUUID); perr == nil {
			card, err = uc.cardRepo.FindByID(idInt)
		}
		if err != nil {
			return err
		}
		if card.UserID != userID {
			return fmt.Errorf("UNAUTHORIZED_ACTION")
		}
		return uc.cardRepo.SetDefault(userID, card.ID)
	}

	if card.UserID != userID {
		return fmt.Errorf("UNAUTHORIZED_ACTION")
	}

	return uc.cardRepo.SetDefault(userID, card.ID)
}
