import {fileStore, FSNode} from "./fileStore";
import {settingsStore} from "./settingsStore";
import {proxy} from "valtio";

export const rootStore = proxy({
    fileStore,
    settingsStore,
    get recentChronoNotes(): FSNode[] {
        return Object.entries(fileStore.files).filter(it => {
            const fileMatches = !!it[1].name.match(settingsStore.dailyNotePattern)
            const dirMatches = it[0].startsWith(settingsStore.chronoNotesDirectory)
            return dirMatches && fileMatches
        }).map(it => it[1])
    }
})

// @ts-ignore
window.store = rootStore