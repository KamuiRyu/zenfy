package usecase

import "zenfy-api/application/service"

type SetDefaultCardUseCase struct {
	cardService service.CardService
}

func NewSetDefaultCardUseCase(cardService service.CardService) *SetDefaultCardUseCase {
	return &SetDefaultCardUseCase{
		cardService: cardService,
	}
}

func (uc *SetDefaultCardUseCase) Execute(userID int, cardUUID string) error {
	return uc.cardService.SetDefaultCard(userID, cardUUID)
}
