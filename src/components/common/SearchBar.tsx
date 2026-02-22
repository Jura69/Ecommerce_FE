import { TextField, InputAdornment, SxProps, Theme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { tokens } from '../../theme/theme';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  fullWidth = true,
  sx = {},
}: SearchBarProps) {
  return (
    <TextField
      fullWidth={fullWidth}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      size="small"
      sx={{
        '& .MuiOutlinedInput-root': {
          bgcolor: tokens.colors.white,
          borderRadius: '10px',
        },
        ...sx,
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: tokens.colors.stone400 }} />
          </InputAdornment>
        ),
      }}
    />
  );
}
