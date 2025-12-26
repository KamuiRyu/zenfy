package service

import (
	"fmt"
	"time"

	"github.com/google/uuid"

	"zenfy-api/application/dto"
	"zenfy-api/domain/model"
	"zenfy-api/domain/repository"
)

type CardService interface {
	CreateCard(userID int, req dto.AddCardRequest) (*dto.CardResponse, error)
	GetUserCards(userID int) ([]dto.CardResponse, error)
	GetCardByUUID(userID int, cardUUID string) (*dto.CardResponse, error)
	UpdateCard(userID int, cardUUID string, req dto.UpdateCardRequest) (*dto.CardResponse, error)
	DeleteCard(userID int, cardUUID string) error
	SetDefaultCard(userID int, cardUUID string) error
}

type cardService struct {
	cardRepo repository.CardRepository
}

func NewCardService(cardRepo repository.CardRepository) CardService {
	return &cardService{
		cardRepo: cardRepo,
	}
}

func (s *cardService) CreateCard(userID int, req dto.AddCardRequest) (*dto.CardResponse, error) {
	if err := s.validateExpiryDate(req.ExpiryMonth, req.ExpiryYear); err != nil {
		return nil, err
	}

	existingCards, err := s.cardRepo.FindByUserID(userID)
	if err != nil {
		return nil, fmt.Errorf("CARD_NOT_FOUND")
	}
	isDefault := len(existingCards) == 0 || req.IsDefault

	if isDefault && len(existingCards) > 0 {
		for _, card := range existingCards {
			if card.IsDefault {
				card.IsDefault = false
				if err := s.cardRepo.Update(card); err != nil {
					return nil, fmt.Errorf("FAILED_TO_UNSET_CURRENT_DEFAULT_CARD")
				}
				break
			}
		}
	}

	// generate uuid for card
	cardUuid := uuid.New().String()

	card := model.NewCard(
		userID,
		cardUuid,
		req.LastFour,
		req.Brand,
		req.Bank,
		model.CardType(req.CardType),
		req.HolderName,
		req.Nickname,
		req.ExpiryMonth,
		req.ExpiryYear,
		req.BillingDay,
		isDefault,
	)

	if err := s.cardRepo.Create(card); err != nil {
		return nil, fmt.Errorf("FAILED_TO_CREATE_CARD")
	}

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

func (s *cardService) GetUserCards(userID int) ([]dto.CardResponse, error) {
	cards, err := s.cardRepo.FindByUserID(userID)
	if err != nil {
		return nil, fmt.Errorf("CARD_NOT_FOUND")
	}

	responses := make([]dto.CardResponse, len(cards))
	for i, card := range cards {
		responses[i] = dto.CardResponse{
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
		}
	}

	return responses, nil
}

func (s *cardService) GetCardByUUID(userID int, cardUUID string) (*dto.CardResponse, error) {
	card, err := s.cardRepo.FindByUUID(cardUUID)
	if err != nil {
		return nil, fmt.Errorf("CARD_NOT_FOUND")
	}

	if card.UserID != userID {
		return nil, fmt.Errorf("CARD_DOES_NOT_BELONG_TO_USER")
	}

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

func (s *cardService) UpdateCard(userID int, cardUUID string, req dto.UpdateCardRequest) (*dto.CardResponse, error) {

	if err := s.validateExpiryDate(req.ExpiryMonth, req.ExpiryYear); err != nil {
		return nil, err
	}

	// Check if card exists and belongs to user
	card, err := s.cardRepo.FindByUUID(cardUUID)
	if err != nil {
		return nil, fmt.Errorf("CARD_NOT_FOUND")
	}

	if card.UserID != userID {
		return nil, fmt.Errorf("CARD_DOES_NOT_BELONG_TO_USER")
	}

	// Update card fields
	card.LastFour = req.LastFour
	card.Brand = req.Brand
	if req.Bank != "" {
		card.Bank = req.Bank
	}
	card.CardType = model.CardType(req.CardType)
	card.HolderName = req.HolderName
	if req.Nickname != "" {
		card.Nickname = req.Nickname
	}
	card.ExpiryMonth = req.ExpiryMonth
	card.ExpiryYear = req.ExpiryYear
	card.BillingDay = req.BillingDay

	// Handle default card logic
	if req.IsDefault && !card.IsDefault {
		// User wants to set this as default, unset current default
		existingCards, err := s.cardRepo.FindByUserID(userID)
		if err != nil {
			return nil, fmt.Errorf("CARD_NOT_FOUND")
		}

		for _, c := range existingCards {
			if c.IsDefault && c.ID != card.ID {
				c.IsDefault = false
				if err := s.cardRepo.Update(c); err != nil {
					return nil, fmt.Errorf("FAILED_TO_UNSET_CURRENT_DEFAULT_CARD")
				}
				break
			}
		}
		card.IsDefault = true
	} else if !req.IsDefault && card.IsDefault {
		// User wants to unset this as default
		card.IsDefault = false
	}

	// Update card in database
	if err := s.cardRepo.Update(card); err != nil {
		return nil, fmt.Errorf("FAILED_TO_UPDATE_CARD")
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

func (s *cardService) DeleteCard(userID int, cardUUID string) error {
	card, err := s.cardRepo.FindByUUID(cardUUID)
	if err != nil {
		return fmt.Errorf("CARD_NOT_FOUND")
	}

	if card.UserID != userID {
		return fmt.Errorf("CARD_DOES_NOT_BELONG_TO_USER")
	}

	return s.cardRepo.DeleteByUUID(cardUUID)
}

func (s *cardService) SetDefaultCard(userID int, cardUUID string) error {
	card, err := s.cardRepo.FindByUUID(cardUUID)
	if err != nil {
		return fmt.Errorf("CARD_NOT_FOUND")
	}

	if card.UserID != userID {
		return fmt.Errorf("CARD_DOES_NOT_BELONG_TO_USER")
	}

	return s.cardRepo.SetDefault(userID, card.ID)
}

func (s *cardService) validateExpiryDate(month, year int) error {
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
