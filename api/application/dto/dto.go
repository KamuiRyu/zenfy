package dto

import "github.com/go-playground/validator/v10"

func Validate(i interface{}) error {
	validate := validator.New()
	return validate.Struct(i)
}

func ValidateStruct(i interface{}) error {
	return Validate(i)
}
