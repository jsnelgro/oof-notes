import {proxy} from "valtio";

type ColorSchemeModes = "dark" | "light" | "auto"

export const settingsStore = proxy({
    colorSchemeMode: "auto" as ColorSchemeModes,
    chronoNotesDirectory: "notes/Dailies",
    dailyNotePattern: /\d\d\d\d-\d\d-\d\d\.md/gm,
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
