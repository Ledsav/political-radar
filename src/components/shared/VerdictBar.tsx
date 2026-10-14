import React from 'react';
import {Box, Tooltip, Typography} from '@mui/material';
import {Breakdown} from '../../data/types';
import {breakdownTotal, RATINGS} from '../../data/ratings';

interface VerdictBarProps {
    breakdown: Breakdown;
    height?: number;
    showLegend?: boolean;
}

// Share of each verdict, true (left) to false (right). Counts are always
// available as text in the legend, never by colour alone.
const VerdictBar: React.FC<VerdictBarProps> = ({breakdown, height = 24, showLegend = true}) => {
    const total = breakdownTotal(breakdown);
    if (total === 0) return null;

    return (
        <Box>
            <Box
                role="img"
                aria-label={RATINGS.map((r) => `${r.label}: ${breakdown[r.key]}`).join(', ')}
                sx={{display: 'flex', gap: '2px', height, border: '1px solid black', p: '2px', bgcolor: 'white'}}
            >
                {RATINGS.filter((r) => breakdown[r.key] > 0).map((r) => (
                    <Tooltip key={r.key} title={`${r.label}: ${breakdown[r.key]} (${Math.round((100 * breakdown[r.key]) / total)}%)`} arrow>
                        <Box sx={{flexGrow: breakdown[r.key], flexBasis: 0, bgcolor: r.color, minWidth: 3}}/>
                    </Tooltip>
                ))}
            </Box>
            {showLegend && (
                <Box component="ul" sx={{display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1, mb: 0}}>
                    {RATINGS.map((r) => (
                        <Box component="li" key={r.key} sx={{display: 'flex', alignItems: 'center', gap: 0.75}}>
                            <Box sx={{width: 12, height: 12, bgcolor: r.color, border: '1px solid black'}}/>
                            <Typography variant="body2">
                                {r.label} <strong>{breakdown[r.key]}</strong>
                            </Typography>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default VerdictBar;
