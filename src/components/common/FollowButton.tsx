import { useEffect, useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useFollowStore } from '../../store/followStore';
import { tokens } from '../../theme/theme';

interface FollowButtonProps {
    shopId: string;
    size?: 'small' | 'medium' | 'large';
    variant?: 'contained' | 'outlined' | 'text';
}

export default function FollowButton({ shopId, size = 'small', variant = 'outlined' }: FollowButtonProps) {
    const { followShop, unfollowShop, checkFollow, isFollowing } = useFollowStore();
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(false);
    const following = isFollowing(shopId);

    useEffect(() => {
        if (!checked) {
            checkFollow(shopId).then(() => setChecked(true));
        }
    }, [shopId, checked, checkFollow]);

    const handleToggle = async () => {
        setLoading(true);
        try {
            if (following) {
                await unfollowShop(shopId);
            } else {
                await followShop(shopId);
            }
        } catch (error) {
            console.error('Follow toggle failed:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!checked) return null;

    return (
        <Button
            size={size}
            variant={following ? 'contained' : variant}
            onClick={handleToggle}
            disabled={loading}
            startIcon={
                loading ? (
                    <CircularProgress size={16} />
                ) : following ? (
                    <FavoriteIcon />
                ) : (
                    <FavoriteBorderIcon />
                )
            }
            sx={{
                borderRadius: '20px',
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                ...(following
                    ? {
                        bgcolor: tokens.colors.gold700,
                        color: '#fff',
                        '&:hover': { bgcolor: tokens.colors.gold800 },
                    }
                    : {
                        borderColor: tokens.colors.gold700,
                        color: tokens.colors.gold700,
                        '&:hover': {
                            borderColor: tokens.colors.gold800,
                            bgcolor: `${tokens.colors.gold700}10`,
                        },
                    }),
            }}
        >
            {following ? 'Following' : 'Follow'}
        </Button>
    );
}
