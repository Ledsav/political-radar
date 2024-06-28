import React from 'react';
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {isPolitician, SearchableItem} from '../../types/types';
import {useTheme} from "@mui/material";
import {mapCredibilityScore} from "../../utils/scoresOperations";

interface RankingChartProps {
    data: SearchableItem[];
}

const RankingChart: React.FC<RankingChartProps> = ({data}) => {
    const theme = useTheme()
    const chartData = data.map(item => ({
        name: isPolitician(item) ? item.author : item.party,
        credibilityScore: mapCredibilityScore(item.average_score),
    })).sort((a, b) => b.credibilityScore - a.credibilityScore);

    return (
        <ResponsiveContainer width="100%" height={1000}>
            <BarChart
                layout="vertical"
                width={1000}
                height={1000}
                data={chartData}
                margin={{
                    top: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis type="number"/>
                <YAxis
                    type="category"
                    dataKey="name"
                    width={200}
                    tick={{fontSize: 12}}
                />
                <Tooltip/>
                <Legend/>
                <Bar dataKey="credibilityScore" fill={theme.palette.primary.main}/>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default RankingChart;
