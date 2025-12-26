package usecase

import (
	"zenfy-api/application/dto"
	"zenfy-api/application/service"
)

type CreateCardUseCase struct {
	cardService service.CardService
	validator   service.ValidationService
}

func NewCreateCardUseCase(
	cardService service.CardService,
	validator service.ValidationService,
) *CreateCardUseCase {
	return &CreateCardUseCase{
		cardService: cardService,
		validator:   validator,
	}
}

func (uc *CreateCardUseCase) Execute(userID int, input dto.AddCardRequest) (*dto.CardResponse, error) {
	if err := uc.validator.Validate(&input); err != nil {
		return nil, err
	}

	return uc.cardService.CreateCard(userID, input)
}
