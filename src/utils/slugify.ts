export function slugify(str: string) {
    return str.trim().replace(" ", "-").toLowerCase();
}
