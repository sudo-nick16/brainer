import { useEffect, useState } from 'react';
import { setItem } from './storage';

export function useLocalStorage<T>(initialValue: T | (() => T), key?: string) {
    const [state, setState] = useState<T>(initialValue);

    useEffect(() => {
        setItem(key || 'brainer', state);
    }, [state])

    return [state, setState] as [T, React.Dispatch<React.SetStateAction<T>>];
}
