import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    FormControl,
    FormGroup,
    FormControlLabel,
    Checkbox,
    TextField,
    Button,
    Rating,
    Divider,
    CircularProgress,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { categoryService, CategoryData } from '../../services/api/categoryService';

interface FilterPanelProps {
    selectedCategory: string;
    priceMin: string;
    priceMax: string;
    rating: number;
    onCategoryChange: (categoryId: string) => void;
    onPriceMinChange: (value: string) => void;
    onPriceMaxChange: (value: string) => void;
    onRatingChange: (value: number) => void;
    onApply: () => void;
    onClear: () => void;
}

export default function FilterPanel({
    selectedCategory,
    priceMin,
    priceMax,
    rating,
    onCategoryChange,
    onPriceMinChange,
    onPriceMaxChange,
    onRatingChange,
    onApply,
    onClear,
}: FilterPanelProps) {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await categoryService.getCategories();
                setCategories(response?.metadata || []);
            } catch {
                // Silently fail
            } finally {
                setLoadingCategories(false);
            }
        };
        loadCategories();
    }, []);

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <FilterListIcon />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Filters
                </Typography>
            </Box>

            {/* Categories */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Category
                </Typography>
                {loadingCategories ? (
                    <CircularProgress size={20} />
                ) : (
                    <FormControl component="fieldset">
                        <FormGroup>
                            {categories.map((cat) => (
                                <FormControlLabel
                                    key={cat._id}
                                    control={
                                        <Checkbox
                                            checked={selectedCategory === cat._id}
                                            onChange={() => onCategoryChange(selectedCategory === cat._id ? '' : cat._id)}
                                            size="small"
                                        />
                                    }
                                    label={
                                        <Typography variant="body2">
                                            {cat.category_name}
                                            {cat.category_productCount !== undefined && (
                                                <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                                                    ({cat.category_productCount})
                                                </Typography>
                                            )}
                                        </Typography>
                                    }
                                />
                            ))}
                        </FormGroup>
                    </FormControl>
                )}
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Price range */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Price Range
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                        size="small"
                        placeholder="Min"
                        value={priceMin}
                        onChange={(e) => onPriceMinChange(e.target.value)}
                        type="number"
                        sx={{ flex: 1 }}
                    />
                    <Typography variant="body2">—</Typography>
                    <TextField
                        size="small"
                        placeholder="Max"
                        value={priceMax}
                        onChange={(e) => onPriceMaxChange(e.target.value)}
                        type="number"
                        sx={{ flex: 1 }}
                    />
                </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Rating */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Minimum Rating
                </Typography>
                <Rating
                    value={rating}
                    onChange={(_, newValue) => onRatingChange(newValue || 0)}
                    precision={1}
                />
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Action buttons */}
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" onClick={onApply} fullWidth size="small">
                    Apply
                </Button>
                <Button
                    variant="outlined"
                    onClick={onClear}
                    startIcon={<ClearIcon />}
                    fullWidth
                    size="small"
                >
                    Clear
                </Button>
            </Box>
        </Box>
    );
}
