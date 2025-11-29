import { Alert, AlertTitle, Button, Box, AlertColor } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface ErrorDisplayProps {
  error: string | Error | null | undefined;
  title?: string;
  onRetry?: () => void;
  retryLabel?: string;
  severity?: AlertColor;
  sx?: any;
}

export default function ErrorDisplay({
  error,
  title = 'Error',
  onRetry,
  retryLabel = 'Retry',
  severity = 'error',
  sx,
}: ErrorDisplayProps) {
  if (!error) return null;

  const errorMessage =
    typeof error === 'string' ? error : error?.message || 'An error occurred';

  return (
    <Alert
      severity={severity}
      icon={<ErrorOutlineIcon />}
      action={
        onRetry && (
          <Button color="inherit" size="small" onClick={onRetry}>
            {retryLabel}
          </Button>
        )
      }
      sx={{ mb: 3, ...sx }}
    >
      <AlertTitle>{title}</AlertTitle>
      {errorMessage}
    </Alert>
  );
}

