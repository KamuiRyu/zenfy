package service

import "zenfy-api/application/dto"

type validationServiceImpl struct{}

func NewValidationService() ValidationService {
	return &validationServiceImpl{}
}

func (s *validationServiceImpl) Validate(i interface{}) error {
	return dto.Validate(i)
}
