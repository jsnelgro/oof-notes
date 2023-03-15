export const uuid = (t = 21) => crypto
    .getRandomValues(new Uint8Array(t))
    .reduce(((t, e) => {
        return t += (e &= 63) < 36 ? e.toString(36) : e < 62 ? (e - 26).toString(36).toUpperCase() : e > 62 ? "-" : "_";
    }), "");

export async function wait(ms: number) {
    return new Promise((cb) => setTimeout(cb, ms))
}
