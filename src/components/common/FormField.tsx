import { TextField, TextFieldProps } from '@mui/material';

interface FormFieldProps extends Omit<TextFieldProps, 'onChange' | 'onBlur'> {
  name: string;
  label: string;
  value: string | number | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: boolean;
  touched?: boolean;
}

export default function FormField({
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  touched,
  type = 'text',
  required = false,
  fullWidth = true,
  multiline = false,
  rows = 1,
  ...props
}: FormFieldProps) {
  return (
    <TextField
      name={name}
      label={label}
      type={type}
      value={value || ''}
      onChange={onChange}
      onBlur={onBlur}
      error={touched && !!error}
      helperText={touched && error}
      required={required}
      fullWidth={fullWidth}
      multiline={multiline}
      rows={rows}
      {...props}
    />
  );
}

