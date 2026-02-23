import { useState, useMemo } from 'react';
import { Box, Typography, Chip, Divider } from '@mui/material';
import { tokens } from '../../theme/theme';
import { formatters } from '../../utils';

interface VariationTier {
    type: string;
    values: string[];
}

interface SkuItem {
    _id: string;
    sku_tier_idx: number[];
    sku_price: number;
    sku_stock: number;
}

export interface SelectedSku {
    skuId: string;
    price: number;
    stock: number;
    tierIdx: number[];
    label: string;
}

interface VariationSelectorProps {
    variations: VariationTier[];
    skus: SkuItem[];
    onSelect: (sku: SelectedSku | null) => void;
}

export default function VariationSelector({ variations, skus, onSelect }: VariationSelectorProps) {
    // selectedTiers[tierIndex] = valueIndex or -1 (not selected)
    const [selectedTiers, setSelectedTiers] = useState<number[]>(
        variations.map(() => -1)
    );

    // Compute which values are available (have at least one in-stock SKU)
    const availableValues = useMemo(() => {
        return variations.map((tier, tierIndex) => {
            return tier.values.map((_, valueIndex) => {
                // Check if any SKU matches this value + all other selected tiers
                return skus.some((sku) => {
                    if (sku.sku_stock <= 0) return false;
                    if (sku.sku_tier_idx[tierIndex] !== valueIndex) return false;
                    // Check compatibility with other selected tiers
                    return selectedTiers.every((selected, i) => {
                        if (i === tierIndex) return true; // skip current tier
                        if (selected === -1) return true; // not selected yet
                        return sku.sku_tier_idx[i] === selected;
                    });
                });
            });
        });
    }, [variations, skus, selectedTiers]);

    // Find matching SKU when all tiers selected
    const matchedSku = useMemo(() => {
        if (selectedTiers.some((t) => t === -1)) return null;
        return skus.find(
            (sku) =>
                sku.sku_tier_idx.length === selectedTiers.length &&
                sku.sku_tier_idx.every((idx, i) => idx === selectedTiers[i])
        ) || null;
    }, [skus, selectedTiers]);

    // Price range for display when no SKU selected
    const priceRange = useMemo(() => {
        const activePrices = skus.filter((s) => s.sku_stock > 0).map((s) => s.sku_price);
        if (activePrices.length === 0) return null;
        const min = Math.min(...activePrices);
        const max = Math.max(...activePrices);
        return { min, max, isSame: min === max };
    }, [skus]);

    const handleSelect = (tierIndex: number, valueIndex: number) => {
        const newTiers = [...selectedTiers];
        // Toggle off if same value clicked
        newTiers[tierIndex] = newTiers[tierIndex] === valueIndex ? -1 : valueIndex;
        setSelectedTiers(newTiers);

        // Notify parent
        if (newTiers.some((t) => t === -1)) {
            onSelect(null);
        } else {
            const matched = skus.find(
                (sku) =>
                    sku.sku_tier_idx.length === newTiers.length &&
                    sku.sku_tier_idx.every((idx, i) => idx === newTiers[i])
            );
            if (matched) {
                const label = newTiers
                    .map((valIdx, tierIdx) => variations[tierIdx]?.values[valIdx])
                    .filter(Boolean)
                    .join(' / ');
                onSelect({
                    skuId: matched._id,
                    price: matched.sku_price,
                    stock: matched.sku_stock,
                    tierIdx: newTiers,
                    label,
                });
            } else {
                onSelect(null);
            }
        }
    };

    return (
        <Box>
            {/* Price Display */}
            <Box sx={{ mb: 2 }}>
                {matchedSku ? (
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            fontFamily: '"Rubik", sans-serif',
                            color: tokens.colors.gold700,
                        }}
                    >
                        {formatters.currency(matchedSku.sku_price)}
                    </Typography>
                ) : priceRange ? (
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            fontFamily: '"Rubik", sans-serif',
                            color: tokens.colors.gold700,
                        }}
                    >
                        {priceRange.isSame
                            ? formatters.currency(priceRange.min)
                            : `${formatters.currency(priceRange.min)} - ${formatters.currency(priceRange.max)}`}
                    </Typography>
                ) : null}
            </Box>

            {/* Variation Tiers */}
            {variations.map((tier, tierIndex) => (
                <Box key={tier.type} sx={{ mb: 2 }}>
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 600,
                            color: tokens.colors.stone600,
                            mb: 1,
                            textTransform: 'uppercase',
                            fontSize: '0.75rem',
                            letterSpacing: '0.05em',
                        }}
                    >
                        {tier.type}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {tier.values.map((value, valueIndex) => {
                            const isSelected = selectedTiers[tierIndex] === valueIndex;
                            const isAvailable = availableValues[tierIndex]?.[valueIndex] ?? true;

                            return (
                                <Chip
                                    key={value}
                                    label={value}
                                    clickable={isAvailable}
                                    onClick={() => isAvailable && handleSelect(tierIndex, valueIndex)}
                                    variant={isSelected ? 'filled' : 'outlined'}
                                    sx={{
                                        fontWeight: isSelected ? 700 : 500,
                                        borderColor: isSelected
                                            ? tokens.colors.gold600
                                            : isAvailable
                                                ? tokens.colors.stone300
                                                : tokens.colors.stone200,
                                        bgcolor: isSelected
                                            ? tokens.colors.gold50
                                            : 'transparent',
                                        color: isSelected
                                            ? tokens.colors.gold800
                                            : isAvailable
                                                ? tokens.colors.stone700
                                                : tokens.colors.stone300,
                                        opacity: isAvailable ? 1 : 0.5,
                                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                                        '&:hover': isAvailable
                                            ? {
                                                borderColor: tokens.colors.gold500,
                                                bgcolor: isSelected ? tokens.colors.gold100 : tokens.colors.stone50,
                                            }
                                            : {},
                                        transition: 'all 0.15s ease',
                                    }}
                                />
                            );
                        })}
                    </Box>
                </Box>
            ))}

            {/* Stock Info */}
            {matchedSku && (
                <>
                    <Divider sx={{ my: 1.5 }} />
                    <Typography
                        variant="body2"
                        sx={{
                            color: matchedSku.sku_stock > 5 ? tokens.colors.stone500 : tokens.colors.error,
                            fontWeight: matchedSku.sku_stock <= 5 ? 600 : 400,
                        }}
                    >
                        {matchedSku.sku_stock > 0
                            ? `${matchedSku.sku_stock} available`
                            : 'Out of stock'}
                    </Typography>
                </>
            )}
        </Box>
    );
}
