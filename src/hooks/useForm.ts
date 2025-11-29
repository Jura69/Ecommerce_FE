import { useState, useCallback } from 'react';

type ValidateFn<T> = (name: keyof T, value: any, allValues: T) => string | null;

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  validate: () => boolean;
  reset: (newValues?: T) => void;
  setValue: (name: keyof T, value: any) => void;
  setValues: React.Dispatch<React.SetStateAction<T>>;
}

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validateFn?: ValidateFn<T>
): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));

      if (touched[name as keyof T] && errors[name as keyof T]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name as keyof T];
          return newErrors;
        });
      }
    },
    [touched, errors]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      if (validateFn) {
        const fieldError = validateFn(name as keyof T, values[name as keyof T], values);
        if (fieldError) {
          setErrors((prev) => ({ ...prev, [name]: fieldError }));
        } else {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[name as keyof T];
            return newErrors;
          });
        }
      }
    },
    [values, validateFn]
  );

  const validate = useCallback((): boolean => {
    if (!validateFn) return true;

    const newErrors: Partial<Record<keyof T, string>> = {};
    Object.keys(values).forEach((key) => {
      const error = validateFn(key as keyof T, values[key as keyof T], values);
      if (error) {
        newErrors[key as keyof T] = error;
      }
    });

    setErrors(newErrors);
    setTouched(
      Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Partial<Record<keyof T, boolean>>
      )
    );

    return Object.keys(newErrors).length === 0;
  }, [values, validateFn]);

  const reset = useCallback(
    (newValues: T = initialValues) => {
      setValues(newValues);
      setErrors({});
      setTouched({});
    },
    [initialValues]
  );

  const setValue = useCallback(
    (name: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset,
    setValue,
    setValues,
  };
}

