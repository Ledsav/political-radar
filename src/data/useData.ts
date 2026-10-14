import {DependencyList, useEffect, useState} from 'react';

export interface AsyncState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export function useData<T>(load: () => Promise<T>, deps: DependencyList = []): AsyncState<T> {
    const [state, setState] = useState<AsyncState<T>>({data: null, loading: true, error: null});

    useEffect(() => {
        let active = true;
        setState({data: null, loading: true, error: null});
        load().then(
            (data) => active && setState({data, loading: false, error: null}),
            (err: unknown) => active && setState({data: null, loading: false, error: err instanceof Error ? err.message : String(err)}),
        );
        return () => {
            active = false;
        };
    }, deps);

    return state;
}
