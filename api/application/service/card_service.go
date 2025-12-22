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
	AddCard(userID int, req dto.AddCardRequest) (*dto.CardResponse, error)
	GetUserCards(userID int) ([]dto.CardResponse, error)
	GetCardByID(userID, cardID int) (*dto.CardResponse, error)
	DeleteCard(userID, cardID int) error
	SetDefaultCard(userID, cardID int) error
}

type cardService struct {
	cardRepo repository.CardRepository
}

func NewCardService(cardRepo repository.CardRepository) CardService {
	return &cardService{
		cardRepo: cardRepo,
	}
}

func (s *cardService) AddCard(userID int, req dto.AddCardRequest) (*dto.CardResponse, error) {

	if err := s.validateExpiryDate(req.ExpiryMonth, req.ExpiryYear); err != nil {
		return nil, err
	}

	existingCards, err := s.cardRepo.FindByUserID(userID)
	if err != nil {
		return nil, err
	}
	isDefault := len(existingCards) == 0 || req.IsDefault

	if isDefault && len(existingCards) > 0 {
		for _, card := range existingCards {
			if card.IsDefault {
				card.IsDefault = false
				if err := s.cardRepo.Update(card); err != nil {
					return nil, fmt.Errorf("failed to unset current default card: %w", err)
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
		model.CardType(req.CardType),
		req.HolderName,
		req.Nickname,
		req.ExpiryMonth,
		req.ExpiryYear,
		req.BillingDay,
		isDefault,
	)

	if err := s.cardRepo.Create(card); err != nil {
		return nil, fmt.Errorf("failed to create card: %w", err)
	}

	return &dto.CardResponse{
		Uuid:        card.Uuid,
		LastFour:    card.LastFour,
		Brand:       card.Brand,
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
		return nil, err
	}

	responses := make([]dto.CardResponse, len(cards))
	for i, card := range cards {
		responses[i] = dto.CardResponse{
			LastFour:    card.LastFour,
			Brand:       card.Brand,
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

func (s *cardService) GetCardByID(userID, cardID int) (*dto.CardResponse, error) {
	card, err := s.cardRepo.FindByID(cardID)
	if err != nil {
		return nil, err
	}

	if card.UserID != userID {
		return nil, fmt.Errorf("card does not belong to user")
	}

	return &dto.CardResponse{
		LastFour:    card.LastFour,
		Brand:       card.Brand,
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

func (s *cardService) DeleteCard(userID, cardID int) error {
	card, err := s.cardRepo.FindByID(cardID)
	if err != nil {
		return err
	}

	if card.UserID != userID {
		return fmt.Errorf("card does not belong to user")
	}

	return s.cardRepo.Delete(cardID)
}

func (s *cardService) SetDefaultCard(userID, cardID int) error {
	card, err := s.cardRepo.FindByID(cardID)
	if err != nil {
		return err
	}

	if card.UserID != userID {
		return fmt.Errorf("card does not belong to user")
	}

	return s.cardRepo.SetDefault(userID, cardID)
}

func (s *cardService) validateExpiryDate(month, year int) error {
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
