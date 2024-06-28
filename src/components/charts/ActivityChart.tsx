import React, {useEffect, useState} from 'react';
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {isPolitician, SearchableItem} from '../../types/types';
import {useTheme} from "@mui/material";
import {getScoreReferences, mapActivityScore} from "../../utils/scoresOperations";


interface ActivityChartProps {
    data: SearchableItem[];
    collectionName: string;
}


const ActivityChart: React.FC<ActivityChartProps> = ({data, collectionName}) => {
    const theme = useTheme();
    const [scoreReferences, setScoreReferences] = useState<any>({});
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        const fetchChartData = async () => {
            const references = await getScoreReferences(collectionName);
            setScoreReferences(references);

            const mappedData = data.map(item => ({
                name: isPolitician(item) ? item.author : item.party,
                activityScore: mapActivityScore(item.activity_score, references.avgActivityScore, references.stdActivityScore)
            })).sort((a, b) => b.activityScore - a.activityScore);

            setChartData(mappedData);
        };

        fetchChartData();
    }, [collectionName, data]);

    return (
        <ResponsiveContainer width="100%" height={1000}>
            <BarChart
                layout="vertical"
                width={1000}
                height={800}
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
                <Bar dataKey="activityScore" fill="#82ca9d"/>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default ActivityChart;
