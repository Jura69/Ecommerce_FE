import { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Rating,
    Paper,
    Avatar,
    Chip,
    LinearProgress,
    Divider,
    Pagination,
    FormControl,
    Select,
    MenuItem,
    Alert,
    CircularProgress,
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import StarIcon from '@mui/icons-material/Star';
import { reviewService, ReviewData, ReviewStatsData } from '../../services/api/reviewService';

interface ReviewSectionProps {
    productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
    const [reviews, setReviews] = useState<ReviewData[]>([]);
    const [stats, setStats] = useState<ReviewStatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sort, setSort] = useState('newest');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const loadReviews = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await reviewService.getProductReviews(productId, { sort, page, limit: 5 });
            const data = response?.metadata;
            if (data) {
                setReviews(data.reviews || []);
                setTotalPages(data.totalPages || 1);
            }
        } catch (err: any) {
            setError(err?.message || 'Failed to load reviews');
        } finally {
            setLoading(false);
        }
    }, [productId, sort, page]);

    const loadStats = useCallback(async () => {
        try {
            const response = await reviewService.getReviewStats(productId);
            setStats(response?.metadata || null);
        } catch {
            // silently fail for stats
        }
    }, [productId]);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    useEffect(() => {
        loadReviews();
    }, [loadReviews]);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Reviews & Ratings
            </Typography>

            {/* Stats summary */}
            {stats && stats.totalReviews > 0 && (
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Average rating */}
                        <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                            <Typography variant="h2" sx={{ fontWeight: 700, lineHeight: 1 }}>
                                {stats.averageRating}
                            </Typography>
                            <Rating value={stats.averageRating} precision={0.1} readOnly size="small" />
                            <Typography variant="body2" color="text.secondary">
                                {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
                            </Typography>
                        </Box>

                        {/* Distribution bars */}
                        <Box sx={{ flex: 1, minWidth: 200 }}>
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = stats.distribution[star] || 0;
                                const pct = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                                return (
                                    <Box key={star} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                        <Typography variant="body2" sx={{ minWidth: 16, textAlign: 'right' }}>
                                            {star}
                                        </Typography>
                                        <StarIcon sx={{ fontSize: 14, color: 'warning.main' }} />
                                        <LinearProgress
                                            variant="determinate"
                                            value={pct}
                                            sx={{ flex: 1, height: 8, borderRadius: 4 }}
                                        />
                                        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 24 }}>
                                            {count}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                </Paper>
            )}

            {stats && stats.totalReviews === 0 && (
                <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                        No reviews yet. Be the first to review this product!
                    </Typography>
                </Paper>
            )}

            {/* Sort + reviews list */}
            {stats && stats.totalReviews > 0 && (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle2">
                            {stats.totalReviews} Review{stats.totalReviews !== 1 ? 's' : ''}
                        </Typography>
                        <FormControl size="small" sx={{ minWidth: 140 }}>
                            <Select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
                                <MenuItem value="newest">Newest</MenuItem>
                                <MenuItem value="highest">Highest Rating</MenuItem>
                                <MenuItem value="lowest">Lowest Rating</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        reviews.map((review, index) => (
                            <Box key={review._id}>
                                <Box sx={{ py: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
                                            {review.review_userId?.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </Avatar>
                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Typography variant="subtitle2">
                                                    {review.review_userId?.name || 'User'}
                                                </Typography>
                                                {review.review_isVerified && (
                                                    <Chip
                                                        icon={<VerifiedIcon />}
                                                        label="Verified Purchase"
                                                        size="small"
                                                        color="success"
                                                        variant="outlined"
                                                        sx={{ height: 20, fontSize: '0.7rem' }}
                                                    />
                                                )}
                                            </Box>
                                            <Typography variant="caption" color="text.secondary">
                                                {formatDate(review.createdAt)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Rating value={review.review_rating} readOnly size="small" sx={{ mb: 0.5 }} />

                                    {review.review_title && (
                                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                            {review.review_title}
                                        </Typography>
                                    )}

                                    {review.review_content && (
                                        <Typography variant="body2" color="text.secondary">
                                            {review.review_content}
                                        </Typography>
                                    )}
                                </Box>
                                {index < reviews.length - 1 && <Divider />}
                            </Box>
                        ))
                    )}

                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(_, p) => setPage(p)}
                                size="small"
                            />
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
}
