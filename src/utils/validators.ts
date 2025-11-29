type ValidatorFn = (value: any, allValues?: any) => string | null;
type Validator = ValidatorFn | string | null;

export const validators = {
  required: (value: any): string | null => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return 'This field is required';
    }
    return null;
  },

  email: (value: any): string | null => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },

  minLength: (min: number) => (value: any): string | null => {
    if (!value) return null;
    if (value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return null;
  },

  maxLength: (max: number) => (value: any): string | null => {
    if (!value) return null;
    if (value.length > max) {
      return `Must be no more than ${max} characters`;
    }
    return null;
  },

  min: (min: number) => (value: any): string | null => {
    if (!value) return null;
    const num = Number(value);
    if (isNaN(num) || num < min) {
      return `Must be at least ${min}`;
    }
    return null;
  },

  max: (max: number) => (value: any): string | null => {
    if (!value) return null;
    const num = Number(value);
    if (isNaN(num) || num > max) {
      return `Must be no more than ${max}`;
    }
    return null;
  },

  match: (fieldName: string, getValue: (field: string) => any) => (
    value: any
  ): string | null => {
    if (!value) return null;
    const otherValue = getValue(fieldName);
    if (value !== otherValue) {
      return 'Values do not match';
    }
    return null;
  },

  pattern: (regex: RegExp, message?: string) => (value: any): string | null => {
    if (!value) return null;
    if (!regex.test(value)) {
      return message || 'Invalid format';
    }
    return null;
  },

  combine: (...validators: Validator[]) => (
    value: any,
    allValues?: any
  ): string | null => {
    for (const validator of validators) {
      const error =
        typeof validator === 'function'
          ? validator(value, allValues)
          : validator;
      if (error) return error;
    }
    return null;
  },
};

