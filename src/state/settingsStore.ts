import {proxy} from "valtio";

type ColorSchemeModes = "dark" | "light" | "auto"

export const settingsStore = proxy({
    colorSchemeMode: "auto" as ColorSchemeModes,
    chronoNotesDirectory: "notes/tst_dailies",
    // TODO: stupid noteplan format...
    dailyNotePattern: /\d\d\d\d\d\d\d\d\.md/gm,
    rollingViewLookbackDays: 14,
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
