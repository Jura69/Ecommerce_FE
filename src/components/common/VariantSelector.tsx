import { useState } from 'react';
import { Box, Typography, ToggleButton, ToggleButtonGroup, Chip } from '@mui/material';
import { tokens } from '../../theme/theme';

interface Variation {
    name: string;
    options: string[];
}

interface SkuData {
    _id: string;
    sku_tier_idx: number[];
    sku_price: number;
    sku_stock: number;
}

interface VariantSelectorProps {
    variations: Variation[];
    skus: SkuData[];
    onSelect: (sku: SkuData | null, selectedOptions: Record<string, string>) => void;
}

export default function VariantSelector({ variations, skus, onSelect }: VariantSelectorProps) {
    const [selected, setSelected] = useState<Record<number, number>>({});

    const handleSelect = (varIdx: number, optIdx: number) => {
        const next = { ...selected, [varIdx]: optIdx };
        setSelected(next);

        // Check if all variations are selected
        if (Object.keys(next).length === variations.length) {
            const tierIdx = variations.map((_, i) => next[i]);
            const matchingSku = skus.find(
                (s) => JSON.stringify(s.sku_tier_idx) === JSON.stringify(tierIdx)
            );
            const selectedOptions: Record<string, string> = {};
            variations.forEach((v, i) => { selectedOptions[v.name] = v.options[next[i]]; });
            onSelect(matchingSku || null, selectedOptions);
        }
    };

    // Find selected SKU
    const allSelected = Object.keys(selected).length === variations.length;
    const tierIdx = allSelected ? variations.map((_, i) => selected[i]) : null;
    const currentSku = tierIdx
        ? skus.find((s) => JSON.stringify(s.sku_tier_idx) === JSON.stringify(tierIdx))
        : null;

    return (
        <Box sx={{ my: 2 }}>
            {variations.map((variation, vIdx) => (
                <Box key={vIdx} sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        {variation.name}
                    </Typography>
                    <ToggleButtonGroup
                        value={selected[vIdx] ?? null}
                        exclusive
                        onChange={(_, val) => val !== null && handleSelect(vIdx, val)}
                        size="small"
                    >
                        {variation.options.map((option, oIdx) => (
                            <ToggleButton
                                key={oIdx}
                                value={oIdx}
                                sx={{
                                    px: 2, py: 0.8, borderRadius: '8px !important',
                                    textTransform: 'none', fontWeight: 600,
                                    '&.Mui-selected': {
                                        bgcolor: tokens.colors.stone900,
                                        color: tokens.colors.white,
                                        '&:hover': { bgcolor: tokens.colors.stone800 },
                                    },
                                }}
                            >
                                {option}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Box>
            ))}

            {currentSku && (
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mt: 2, p: 2, borderRadius: '12px', bgcolor: tokens.colors.stone50 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: tokens.colors.gold700 }}>
                        ${currentSku.sku_price}
                    </Typography>
                    <Chip
                        label={currentSku.sku_stock > 0 ? `${currentSku.sku_stock} in stock` : 'Out of stock'}
                        size="small"
                        color={currentSku.sku_stock > 0 ? 'success' : 'error'}
                    />
                </Box>
            )}
        </Box>
    );
}
