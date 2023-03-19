import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";

// NOTE: types don't matter here since the signature is defined globally in interfaces.d.ts
Object.defineProperty(Object.prototype, 'let', {
    value: function (fn: (me: any) => any) {
        return fn(this)
    }
})

/**
 * This lib's weird and plugins are applied globally somehow... so need to call it at top level of app
 */
export const configureGlobalDayJs = () => {
    dayjs.extend(relativeTime);
    dayjs.extend(isToday);
}

export const uuid = (t = 21) => crypto
    .getRandomValues(new Uint8Array(t))
    .reduce(((t, e) => {
        return t += (e &= 63) < 36 ? e.toString(36) : e < 62 ? (e - 26).toString(36).toUpperCase() : e > 62 ? "-" : "_";
    }), "");

export async function wait(ms: number) {
    return new Promise((cb) => setTimeout(cb, ms))
}

// util types

type Path = ReturnType<typeof toPath>
export const toPath = (str: string) => {
    const components = str.split("/").filter(it => it.trim().length > 0)
    const filenameWithExt = components[components.length - 1] ?? ""
    const extIdx = filenameWithExt.lastIndexOf(".")
    const filename = filenameWithExt.slice(0, extIdx === -1 ? undefined : extIdx)
    const extension = extIdx === -1 ? "" : filenameWithExt.slice(extIdx + 1)
    return {
        components,
        filename: str.endsWith("/") ? "" : filename,
        extension: str.endsWith("/") ? "" : extension,
    }
}

export const toPathString = (p: Path): string => {
    return p.components.join("/")
}
