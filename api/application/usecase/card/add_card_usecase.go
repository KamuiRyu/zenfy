package usecase

import (
	"fmt"
	"time"

	"zenfy-api/application/dto"
	"zenfy-api/application/service"
	"zenfy-api/domain/model"
	"zenfy-api/domain/repository"
)

type AddCardUseCase struct {
	cardRepo  repository.CardRepository
	validator service.ValidationService
}

func NewAddCardUseCase(
	cardRepo repository.CardRepository,
	validator service.ValidationService,
) *AddCardUseCase {
	return &AddCardUseCase{
		cardRepo:  cardRepo,
		validator: validator,
	}
}

func (uc *AddCardUseCase) Execute(userID int, input dto.AddCardRequest) (*dto.CardResponse, error) {
	if err := uc.validator.Validate(&input); err != nil {
		return nil, err
	}

	if err := uc.validateExpiryDate(input.ExpiryMonth, input.ExpiryYear); err != nil {
		return nil, err
	}

	existingCards, err := uc.cardRepo.FindByUserID(userID)
	if err != nil {
		return nil, err
	}
	isDefault := len(existingCards) == 0 || input.IsDefault

	if isDefault && len(existingCards) > 0 {
		for _, card := range existingCards {
			if card.IsDefault {
				card.IsDefault = false
				if err := uc.cardRepo.Update(card); err != nil {
					return nil, fmt.Errorf("FAILED_TO_UNSET_DEFAULT_CARD")
				}
				break
			}
		}
	}

	// Create card model
	card := model.NewCard(
		userID,
		input.LastFour,
		input.Brand,
		model.CardType(input.CardType),
		input.HolderName,
		input.Nickname,
		input.ExpiryMonth,
		input.ExpiryYear,
		input.BillingDay,
		isDefault,
	)
	// set optional bank if provided
	if input.Bank != "" {
		card.Bank = input.Bank
	}

	// Save to database
	if err := uc.cardRepo.Create(card); err != nil {
		return nil, fmt.Errorf("FAILED_TO_CREATE_CARD")
	}

	// Return response
	return &dto.CardResponse{
		ID:          card.ID,
		LastFour:    card.LastFour,
		Brand:       card.Brand,
		Bank:        card.Bank,
		CardType:    string(card.CardType),
		HolderName:  card.HolderName,
		Nickname:    card.Nickname,
		ExpiryMonth: card.ExpiryMonth,
		ExpiryYear:  card.ExpiryYear,
		BillingDay:  card.BillingDay,
		IsDefault:   card.IsDefault,
		CreatedAt:   card.CreatedAt.Format(time.RFC3339),
	}, nil
}

func (uc *AddCardUseCase) validateExpiryDate(month, year int) error {
	now := time.Now()
	currentYear := now.Year()
	currentMonth := int(now.Month())

	if year < currentYear {
		return fmt.Errorf("CARD_HAS_EXPIRED")
	}

	if year == currentYear && month < currentMonth {
		return fmt.Errorf("CARD_HAS_EXPIRED")
	}

	return nil
}
