import {fetchFileContentByPath, FileNode, fileStore} from "./fileStore";
import {settingsStore} from "./settingsStore";
import {proxy, snapshot} from "valtio";
import dayjs, {Dayjs} from "dayjs";
import {toPath, toPathString} from "../utils";
import {sortBy} from "remeda";
import {format, isMatch} from 'date-fns'
import {memoize} from "proxy-memoize";

// TODO: how do I enforce this type on sub-stores while keeping the specificity of the store types?
interface StateModule {
    init(): any

    persist(): any
}

type ContentfulNode = FileNode & { content: string }
type ContentfulChronoNode = ContentfulNode & { date: Dayjs }
export const rootStore = proxy({
    stores: {
        fileStore,
        settingsStore,
    },
    get recentChronoNotes(): FileNode[] {
        // @ts-ignore ts is getting annoyed with subtle diffs in snapshot vs store type
        return recentChronoNotes(snapshot(rootStore))
    },
    get todaysNotePath(): string {
        const filename = format(new Date(), settingsStore.dailyNotePattern)
        return toPathString(toPath(
            `${settingsStore.chronoNotesDirectory}/${filename}.${settingsStore.fileType}`
        ))

    },
    async recentChronoNotesWithContent(): Promise<ContentfulChronoNode[]> {
        const res = await Promise.all(rootStore.recentChronoNotes.map(async it => {
            const content = await fetchFileContentByPath(it.path) ?? ""
            const date = dayjs(toPath(it.path).filename)
            return {...it, content, date}
        }))

        return sortBy(res.filter(it => it.content !== ""), (it) => it.date)

    }
})

const recentChronoNotes = memoize<typeof rootStore, FileNode[]>((snap) => {
    const today = dayjs(new Date())
    // TODO: this would be wayyyyy faster if I traverse the filetree instead of iterating over all files
    //  I was just being lazy...
    return Object.entries(snap.stores.fileStore.files)
        .filter(it => {
            /** short circuit */
            if (it[1].kind !== "file") return false

            let filePath = toPath(it[0])
            // check for .icloud extension, which means the files exist but are not loaded locally yet
            const fileTypeMatches = filePath.extension === "icloud"
                ? toPath(filePath.filename).extension === snap.stores.settingsStore.fileType
                : filePath.extension === snap.stores.settingsStore.fileType
            /** short circuit */
            if (!fileTypeMatches) return false

            // const fileMatches = !!filePath.filename.match(settingsStore.dailyNotePattern)
            const fileMatches = isMatch(filePath.filename, snap.stores.settingsStore.dailyNotePattern, {
                // NOTE: see https://github.com/date-fns/date-fns/blob/main/docs/unicodeTokens.md
                //  still can't use YYYY and MM in the same format string though
                useAdditionalDayOfYearTokens: true,
                useAdditionalWeekYearTokens: true,
            })
            /** short circuit */
            if (!fileMatches) return false

            // TODO: should probs just refactor fileStore and strip the root dir from all paths
            const targetDir = toPath(snap.stores.settingsStore.chronoNotesDirectory).components.slice(1)
            const fileDir = filePath.components.slice(1)
            const dirMatches = fileDir.join("/").startsWith(targetDir.join("/"))
            /** short circuit */
            if (!dirMatches) return false

            return true
        })
        .filter(([path, _]) => {
            const p = toPath(path)
            const d = dayjs(p.filename)
            return d.isAfter(today.subtract(snap.stores.settingsStore.rollingViewLookbackDays, "day"))
        })
        .map(it => it[1] as FileNode)
})

// @ts-ignore
window.store = rootStore