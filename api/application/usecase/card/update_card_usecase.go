package usecase

import (
	"fmt"
	"strconv"
	"time"

	"zenfy-api/application/dto"
	"zenfy-api/application/service"
	"zenfy-api/domain/model"
	"zenfy-api/domain/repository"
)

type UpdateCardUseCase struct {
	cardRepo  repository.CardRepository
	validator service.ValidationService
}

func NewUpdateCardUseCase(
	cardRepo repository.CardRepository,
	validator service.ValidationService,
) *UpdateCardUseCase {
	return &UpdateCardUseCase{
		cardRepo:  cardRepo,
		validator: validator,
	}
}

func (uc *UpdateCardUseCase) Execute(userID int, cardUUID string, input dto.UpdateCardRequest) (*dto.CardResponse, error) {
	if err := uc.validator.Validate(&input); err != nil {
		return nil, err
	}

	// Validate expiry date
	if err := uc.validateExpiryDate(input.ExpiryMonth, input.ExpiryYear); err != nil {
		return nil, err
	}

	// Check if card exists and belongs to user
	card, err := uc.cardRepo.FindByUUID(cardUUID)
	if err != nil {
		if idInt, perr := strconv.Atoi(cardUUID); perr == nil {
			card, err = uc.cardRepo.FindByID(idInt)
		}
		if err != nil {
			return nil, fmt.Errorf("card not found")
		}
	}

	if card.UserID != userID {
		return nil, fmt.Errorf("card does not belong to user")
	}

	// Update card fields
	card.LastFour = input.LastFour
	card.Brand = input.Brand
	card.Bank = input.Bank
	card.CardType = model.CardType(input.CardType)
	card.HolderName = input.HolderName
	card.Nickname = input.Nickname
	card.ExpiryMonth = input.ExpiryMonth
	card.ExpiryYear = input.ExpiryYear
	card.BillingDay = input.BillingDay

	// Handle default card logic
	if input.IsDefault && !card.IsDefault {
		// User wants to set this as default, unset current default
		existingCards, err := uc.cardRepo.FindByUserID(userID)
		if err != nil {
			return nil, err
		}

		for _, c := range existingCards {
			if c.IsDefault && c.ID != card.ID {
				c.IsDefault = false
				if err := uc.cardRepo.Update(c); err != nil {
					return nil, fmt.Errorf("failed to unset current default card: %w", err)
				}
				break
			}
		}
		card.IsDefault = true
	} else if !input.IsDefault && card.IsDefault {
		// User wants to unset this as default
		card.IsDefault = false
	}

	// Update card in database
	if err := uc.cardRepo.Update(card); err != nil {
		return nil, fmt.Errorf("failed to update card: %w", err)
	}

	// Return response
	return &dto.CardResponse{
		Uuid:        card.Uuid,
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

func (uc *UpdateCardUseCase) validateExpiryDate(month, year int) error {
	now := time.Now()
	currentYear := now.Year()
	currentMonth := int(now.Month())

	if year < currentYear {
		return fmt.Errorf("card has expired")
	}

	if year == currentYear && month < currentMonth {
		return fmt.Errorf("card has expired")
	}

	return nil
}
