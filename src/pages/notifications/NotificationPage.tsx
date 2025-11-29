import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import { notificationService } from '../../services/api';
import { Notification } from '../../types';

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await notificationService.getNotifications();
        setNotifications(response?.metadata || []);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch notifications');
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ORDER-001':
        return <CheckCircleIcon color="success" />;
      case 'PROMOTION-001':
        return <InfoIcon color="info" />;
      case 'SHOP-001':
        return <WarningIcon color="warning" />;
      default:
        return <NotificationsIcon />;
    }
  };

  const getNotificationColor = (type: string): 'success' | 'info' | 'warning' | 'default' => {
    switch (type) {
      case 'ORDER-001':
        return 'success';
      case 'PROMOTION-001':
        return 'info';
      case 'SHOP-001':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <NotificationsIcon sx={{ mr: 2, fontSize: 32 }} />
        <Typography variant="h4" component="h1">
          Notifications
        </Typography>
        {notifications.length > 0 && (
          <Chip
            label={notifications.length}
            color="primary"
            sx={{ ml: 2 }}
            size="small"
          />
        )}
      </Box>

      {notifications.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <NotificationsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No notifications
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            You're all caught up!
          </Typography>
        </Paper>
      ) : (
        <Paper>
          <List>
            {notifications.map((notification) => (
              <ListItem
                key={notification._id}
                sx={{
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:last-child': {
                    borderBottom: 'none',
                  },
                }}
              >
                <ListItemIcon>
                  {getNotificationIcon(notification.noti_type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {notification.noti_content}
                      </Typography>
                      <Chip
                        label={notification.noti_type}
                        color={getNotificationColor(notification.noti_type)}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {new Date(notification.createdAt).toLocaleString()}
                    </Typography>
                  }
                />
                {notification.noti_status === 'unread' && (
                  <Chip label="New" color="error" size="small" />
                )}
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
}

