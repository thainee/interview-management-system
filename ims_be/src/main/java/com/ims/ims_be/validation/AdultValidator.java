package com.ims.ims_be.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalDate;
import java.time.Period;
import java.sql.Date;

public class AdultValidator implements ConstraintValidator<Adult, Date> {

    @Override
    public boolean isValid(Date date, ConstraintValidatorContext context) {
        if (date == null) {
            return true; // Let @NotNull handle null check
        }
        LocalDate birthDate = date.toLocalDate();
        LocalDate now = LocalDate.now();
        return Period.between(birthDate, now).getYears() >= 18;
    }
}