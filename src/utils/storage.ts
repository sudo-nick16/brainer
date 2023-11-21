export function getItem<T>(key: string, defaultValue: T) {
    const val = localStorage.getItem(key)
    if (!val) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
    }
    let defKeys = Object.keys(defaultValue as any).sort();
    var valKeys = Object.keys(JSON.parse(val)).sort();
    if (JSON.stringify(defKeys) !== JSON.stringify(valKeys)) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
    }
    return JSON.parse(val) as T;
}

export function setItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function removeItem(key: string) {
    localStorage.removeItem(key);
}
