import { useState } from 'react';

export type ValidationRule = {
    required?: boolean;
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    validate?: (value: any, formValues: any) => string | null;
    message?: string;
};

export type ValidationSchema<T> = {
    [K in keyof T]?: ValidationRule;
};

export const useFormValidation = <T extends Record<string, any>>(
    initialValues: T,
    schema: ValidationSchema<T>
) => {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

    const handleChange = (name: keyof T, value: any) => {
        setValues((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing/selecting a new value
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const validateField = (name: keyof T, value: any, currentValues: T) => {
        const rule = schema[name];
        if (!rule) return null;

        let error = null;

        if (rule.required && (value === undefined || value === null || (typeof value === 'string' && value.trim() === ''))) {
            error = rule.message || 'Required';
        } else if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
            error = rule.message || `Minimum length is ${rule.minLength}`;
        } else if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
            error = rule.message || `Maximum length is ${rule.maxLength}`;
        } else if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
            error = rule.message || 'Invalid format';
        } else if (rule.validate) {
            error = rule.validate(value, currentValues);
        }

        return error;
    };

    const validateAll = () => {
        const newErrors: Partial<Record<keyof T, string>> = {};
        let isValid = true;

        (Object.keys(schema) as Array<keyof T>).forEach((key) => {
            const error = validateField(key, values[key], values);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    return {
        values,
        errors,
        handleChange,
        validateAll,
        setValues,
        setErrors,
    };
};
