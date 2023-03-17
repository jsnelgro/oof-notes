import {proxy} from "valtio";

type ColorSchemeModes = "dark" | "light" | "auto"

export const settingsStore = proxy({
    colorSchemeMode: "auto" as ColorSchemeModes,
    chronoNotesDirectory: "",
    // TODO: stupid noteplan format...
    dailyNotePattern: /\d\d\d\d\d\d\d\d/gm,
    fileType: "md",
    rollingViewLookbackDays: 7,
})

export const setChronoNotesDirectory = (nxt: string) => {
    settingsStore.chronoNotesDirectory = nxt
}

export const setDailyNotePattern = (nxt: RegExp) => {
    settingsStore.dailyNotePattern = nxt
}
export const setColorSchemeMode = (colorSchemeMode: ColorSchemeModes) => {
    settingsStore.colorSchemeMode = colorSchemeMode
}
