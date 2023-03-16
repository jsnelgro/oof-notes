import {proxy} from "valtio";

type ColorSchemeModes = "dark" | "light" | "auto"

function SettingsState(/** can inject dependencies! */) {
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
        }
    })
    return state
}

export const state = SettingsState()
export default state