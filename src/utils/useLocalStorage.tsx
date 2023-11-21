import { useEffect, useState } from "react";
import { setItem } from "./storage";

export function useLocalStorage<T>(value: T | (() => T)) {
    const [state, setState] = useState<T>(value);

    useEffect(() => {
        console.log("state updated to ", state);
        setItem("brainer", state);
    }, [state])

    return [state, setState] as [T, React.Dispatch<React.SetStateAction<T>>];
}
