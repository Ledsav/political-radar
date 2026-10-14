import React from 'react';
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis} from 'recharts';
import {Box, Typography} from '@mui/material';
import {Stats} from '../../data/types';
import {breakdownTotal, RATINGS} from '../../data/ratings';

type Ranked = Stats & {name: string};

interface RankingChartProps {
    items: Ranked[];
    title: string;
}

const ROW_HEIGHT = 30;

const ChartTooltip: React.FC<TooltipProps<number, string> & {byName: Map<string, Ranked>}> = ({active, label, byName}) => {
    const item = active && label ? byName.get(String(label)) : undefined;
    if (!item) return null;
    return (
        <Box sx={{bgcolor: 'white', border: '1px solid black', p: 1.5}}>
            <Typography variant="subtitle2" sx={{fontWeight: 'bold'}}>{item.name}</Typography>
            <Typography variant="body2" sx={{mb: 0.5}}>Attendibilità {item.score}/100 (margine {item.score_low}–{item.score_high}) · {item.rated} verifiche</Typography>
            {RATINGS.map((r) => (
                <Typography key={r.key} variant="body2">
                    <Box component="span" sx={{display: 'inline-block', width: 10, height: 10, bgcolor: r.color, border: '1px solid black', mr: 0.75}}/>
                    {r.label}: {item.breakdown[r.key]}
                </Typography>
            ))}
        </Box>
    );
};

// 100% stacked bars, ordered by score: how each politician's or party's
// verified statements split across Pagella Politica's scale.
const RankingChart: React.FC<RankingChartProps> = ({items, title}) => {
    const ranked = [...items].filter((i) => i.reliable).sort((a, b) => b.score - a.score);
    if (ranked.length === 0) return null;

    const byName = new Map(ranked.map((i) => [i.name, i]));
    const rows = ranked.map((i) => {
        const total = breakdownTotal(i.breakdown);
        return {
            name: i.name,
            ...Object.fromEntries(RATINGS.map((r) => [r.key, (100 * i.breakdown[r.key]) / total])),
        };
    });

    return (
        <Box>
            <Typography variant="h2" component="h2" sx={{mb: 1}}>{title}</Typography>
            <Typography variant="body2" sx={{mb: 2}}>
                Solo chi ha almeno il numero minimo di verifiche, ordinati per punteggio. Chi ha punteggi vicini non è
                distinguibile: i margini di errore si sovrappongono (passa il mouse su una barra per vederli).
            </Typography>
            <ResponsiveContainer width="100%" height={ranked.length * ROW_HEIGHT + 80}>
                <BarChart layout="vertical" data={rows} margin={{top: 0, right: 16, bottom: 0, left: 0}} barCategoryGap={4}>
                    <CartesianGrid horizontal={false} stroke="#e0e0e0"/>
                    <XAxis type="number" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={(v: number) => `${v}%`} tickLine={false} axisLine={false}/>
                    <YAxis type="category" dataKey="name" width={170} tick={{fontSize: 12, fill: '#000'}} tickLine={false} interval={0}/>
                    <Tooltip content={<ChartTooltip byName={byName}/>} cursor={{fill: 'rgba(171, 251, 115, 0.35)'}}/>
                    <Legend verticalAlign="top" height={36} formatter={(value) => <span style={{color: '#000'}}>{value}</span>}/>
                    {RATINGS.map((r) => (
                        <Bar key={r.key} dataKey={r.key} name={r.label} stackId="verdicts" fill={r.color}
                             stroke="#fff" strokeWidth={1} isAnimationActive={false}/>
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default RankingChart;
