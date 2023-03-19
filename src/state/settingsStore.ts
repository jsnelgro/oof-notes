import {proxy} from "valtio";

type ColorSchemeModes = "dark" | "light" | "auto"

export const settingsStore = proxy({
    colorSchemeMode: "auto" as ColorSchemeModes,
    chronoNotesDirectory: "/notes/tst_dailies/",
    // stupid noteplan format...
    dailyNotePattern: "yyyyMMdd",
    fileType: "md",
    rollingViewLookbackDays: 7,
})

export const setChronoNotesDirectory = (nxt: string) => {
    settingsStore.chronoNotesDirectory = nxt
}

export const setDailyNotePattern = (nxt: string) => {
    settingsStore.dailyNotePattern = nxt
}
export const setColorSchemeMode = (colorSchemeMode: ColorSchemeModes) => {
    settingsStore.colorSchemeMode = colorSchemeMode
}
