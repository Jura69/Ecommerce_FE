import { useState } from 'prop-types';
import PropTypes from 'prop-types';
import {
  TextField,
  FormControl,
  FormLabel,
  Select as MuiSelect,
  MenuItem,
  FormControlLabel,
  Checkbox as MuiCheckbox,
  RadioGroup as MuiRadioGroup,
  Radio,
  FormHelperText,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

/**
 * Enhanced Input component with built-in validation
 */
export default function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  disabled = false,
  fullWidth = true,
  multiline = false,
  rows = 4,
  placeholder,
  startAdornment,
  endAdornment,
  sx = {},
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value, e);
    }
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const passwordAdornment = type === 'password' && (
    <InputAdornment position="end">
      <IconButton
        onClick={() => setShowPassword(!showPassword)}
        edge="end"
        size="small"
        tabIndex={-1}
      >
        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
      </IconButton>
    </InputAdornment>
  );

  return (
    <TextField
      label={label}
      name={name}
      type={inputType}
      value={value}
      onChange={handleChange}
      onBlur={onBlur}
      error={!!error}
      helperText={error || helperText}
      required={required}
      disabled={disabled}
      fullWidth={fullWidth}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      placeholder={placeholder}
      InputProps={{
        startAdornment: startAdornment,
        endAdornment: endAdornment || passwordAdornment,
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
        },
        ...sx,
      }}
      {...props}
    />
  );
}

Input.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  helperText: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  placeholder: PropTypes.string,
  startAdornment: PropTypes.node,
  endAdornment: PropTypes.node,
  sx: PropTypes.object,
};

/**
 * Select dropdown component
 */
export function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  helperText,
  required = false,
  disabled = false,
  fullWidth = true,
  placeholder = 'Select an option',
  sx = {},
  ...props
}) {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value, e);
    }
  };

  return (
    <FormControl fullWidth={fullWidth} error={!!error} disabled={disabled} required={required}>
      {label && (
        <FormLabel sx={{ mb: 0.5, fontSize: '0.875rem', fontWeight: 500 }}>{label}</FormLabel>
      )}
      <MuiSelect
        name={name}
        value={value}
        onChange={handleChange}
        displayEmpty
        sx={{
          borderRadius: 2,
          ...sx,
        }}
        {...props}
      >
        <MenuItem value="" disabled>
          {placeholder}
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {(error || helperText) && <FormHelperText>{error || helperText}</FormHelperText>}
    </FormControl>
  );
}

Select.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  error: PropTypes.string,
  helperText: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  placeholder: PropTypes.string,
  sx: PropTypes.object,
};

/**
 * Checkbox component
 */
export function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
  color = 'primary',
  sx = {},
  ...props
}) {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.checked, e);
    }
  };

  return (
    <FormControlLabel
      control={
        <MuiCheckbox
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          color={color}
          {...props}
        />
      }
      label={label}
      sx={sx}
    />
  );
}

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  color: PropTypes.string,
  sx: PropTypes.object,
};

/**
 * RadioGroup component
 */
export function RadioGroup({
  label,
  name,
  value,
  onChange,
  options = [],
  row = false,
  error,
  helperText,
  disabled = false,
  sx = {},
  ...props
}) {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value, e);
    }
  };

  return (
    <FormControl component="fieldset" error={!!error} disabled={disabled} sx={sx}>
      {label && (
        <FormLabel component="legend" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
          {label}
        </FormLabel>
      )}
      <MuiRadioGroup name={name} value={value} onChange={handleChange} row={row} {...props}>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={
              option.description ? (
                <div>
                  <div>{option.label}</div>
                  <div style={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                    {option.description}
                  </div>
                </div>
              ) : (
                option.label
              )
            }
          />
        ))}
      </MuiRadioGroup>
      {(error || helperText) && <FormHelperText>{error || helperText}</FormHelperText>}
    </FormControl>
  );
}

RadioGroup.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ),
  row: PropTypes.bool,
  error: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  sx: PropTypes.object,
};
