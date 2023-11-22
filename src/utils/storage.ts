export function getItem<T extends object>(key: string, defaultValue: T) {
  const val = localStorage.getItem(key)
  if (!val) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  const defKeys = Object.keys(defaultValue).sort();
  const valKeys = Object.keys(JSON.parse(val)).sort();
  if (JSON.stringify(defKeys) !== JSON.stringify(valKeys)) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(val) as T;
}

export function setItem<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeItem(key: string) {
  localStorage.removeItem(key);
}
