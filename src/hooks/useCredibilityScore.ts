import {useCallback} from 'react';

const mapRange = (value: number, fromRange: [number, number], toRange: [number, number]): number => {
    const [fromMin, fromMax] = fromRange;
    const [toMin, toMax] = toRange;
    return ((value - fromMin) / (fromMax - fromMin)) * (toMax - toMin) + toMin;
};

export const useCredibilityScore = (credibility: number | null): number => {
    const convertToScore = useCallback(() => {
        if (credibility === null) return 0;
        const clampedValue = Math.max(-1, Math.min(1, credibility));
        return mapRange(clampedValue, [-1, 1], [0, 100]);
    }, [credibility]);

    return convertToScore();
};
