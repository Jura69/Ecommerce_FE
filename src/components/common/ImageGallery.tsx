import { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface ImageGalleryProps {
    images: string[];
    alt?: string;
}

export default function ImageGallery({ images, alt = 'Product' }: ImageGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const allImages = images.length > 0 ? images : ['/placeholder.png'];

    const handlePrev = () => {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
    };

    return (
        <Box>
            {/* Main image */}
            <Box sx={{ position: 'relative', width: '100%', paddingTop: '100%', mb: 1 }}>
                <Box
                    component="img"
                    src={allImages[activeIndex]}
                    alt={`${alt} ${activeIndex + 1}`}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        borderRadius: 1,
                        bgcolor: '#f5f5f5',
                    }}
                />
                {allImages.length > 1 && (
                    <>
                        <IconButton
                            onClick={handlePrev}
                            sx={{
                                position: 'absolute',
                                left: 4,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                bgcolor: 'rgba(255,255,255,0.8)',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' },
                            }}
                            size="small"
                        >
                            <ArrowBackIosIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            onClick={handleNext}
                            sx={{
                                position: 'absolute',
                                right: 4,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                bgcolor: 'rgba(255,255,255,0.8)',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' },
                            }}
                            size="small"
                        >
                            <ArrowForwardIosIcon fontSize="small" />
                        </IconButton>
                    </>
                )}
            </Box>

            {/* Thumbnails */}
            {allImages.length > 1 && (
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {allImages.map((img, idx) => (
                        <Box
                            key={idx}
                            component="img"
                            src={img}
                            alt={`Thumb ${idx + 1}`}
                            onClick={() => setActiveIndex(idx)}
                            sx={{
                                width: 56,
                                height: 56,
                                objectFit: 'cover',
                                borderRadius: 1,
                                border: idx === activeIndex ? '2px solid' : '2px solid transparent',
                                borderColor: idx === activeIndex ? 'primary.main' : 'transparent',
                                cursor: 'pointer',
                                opacity: idx === activeIndex ? 1 : 0.6,
                                transition: 'all 0.2s',
                                '&:hover': { opacity: 1 },
                            }}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
}
