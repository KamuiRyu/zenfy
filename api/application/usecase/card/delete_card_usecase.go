package usecase

import "zenfy-api/application/service"

type DeleteCardUseCase struct {
	cardService service.CardService
}

func NewDeleteCardUseCase(cardService service.CardService) *DeleteCardUseCase {
	return &DeleteCardUseCase{
		cardService: cardService,
	}
}

func (uc *DeleteCardUseCase) Execute(userID int, cardUUID string) error {
	return uc.cardService.DeleteCard(userID, cardUUID)
}
