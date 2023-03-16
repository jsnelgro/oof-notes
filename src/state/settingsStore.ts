import {proxy} from "valtio";

type ColorSchemeModes = "dark" | "light" | "auto"

export type ISettingsStore = ReturnType<typeof SettingsStore>

function SettingsStore(/** can inject dependencies! */) {
    const state = proxy({
        colorSchemeMode: "auto" as ColorSchemeModes,
        notesDirectory: "~/Documents/",
        dailyNotesPath: "/dailies",
        rollingViewLookbackDays: 7,
        setColorSchemeMode: (colorSchemeMode: ColorSchemeModes) => {
            state.colorSchemeMode = colorSchemeMode
        },
        setNotesDirectory: (nxt: string) => {
            state.notesDirectory = nxt
        },
        init: () => {
        },
        persist: () => {
        },
    })
    return state
}

export const state = SettingsStore()
export default state