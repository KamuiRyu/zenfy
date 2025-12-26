package usecase

import (
	"zenfy-api/application/dto"
	"zenfy-api/application/service"
)

type UpdateCardUseCase struct {
	cardService service.CardService
	validator   service.ValidationService
}

func NewUpdateCardUseCase(
	cardService service.CardService,
	validator service.ValidationService,
) *UpdateCardUseCase {
	return &UpdateCardUseCase{
		cardService: cardService,
		validator:   validator,
	}
}

func (uc *UpdateCardUseCase) Execute(userID int, cardUUID string, input dto.UpdateCardRequest) (*dto.CardResponse, error) {
	if err := uc.validator.Validate(&input); err != nil {
		return nil, err
	}
	return uc.cardService.UpdateCard(userID, cardUUID, input)
}
