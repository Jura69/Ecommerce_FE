import { TextField, InputAdornment, Paper, SxProps, Theme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

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
    <Paper sx={{ p: 2, mb: 3, ...sx }}>
      <TextField
        fullWidth={fullWidth}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Paper>
  );
}

