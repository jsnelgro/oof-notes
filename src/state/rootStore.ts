import {fetchFileContentByPath, FileNode, fileStore} from "./fileStore";
import {settingsStore} from "./settingsStore";
import {proxy} from "valtio";
import dayjs from "dayjs";

export const rootStore = proxy({
    fileStore,
    settingsStore,
    get recentChronoNotes(): FileNode[] {
        const today = dayjs(new Date())
        return Object.entries(fileStore.files)
            .filter(it => {
                const fileMatches = !!it[1].name.match(settingsStore.dailyNotePattern)
                const dirMatches = it[0].startsWith(settingsStore.chronoNotesDirectory)
                return dirMatches && fileMatches && it[1].kind === "file"
            })
            .filter(([, it]) => {
                // TODO: do more robust parsing. This just works stupid noteplan format...
                const yyyy = it.name.slice(0, 4)
                const mm = it.name.slice(4, 6)
                const dd = it.name.slice(6, 8)
                const d = dayjs(`${yyyy}-${mm}-${dd}`)
                // const diff = d.diff(today, "days")
                // console.log(diff)
                return d.isAfter(today.subtract(settingsStore.rollingViewLookbackDays, "day"))
            })
            .map(it => it[1] as FileNode)
    },
    async recentChronoNotesContent(): Promise<string[]> {
        return Promise.all(rootStore.recentChronoNotes.map(async it => {
            return await fetchFileContentByPath(it.path) ?? ""
        }))

    }
})

// @ts-ignore
window.store = rootStore