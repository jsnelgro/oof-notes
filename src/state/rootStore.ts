import {fetchFileContentByPath, FileNode, fileStore} from "./fileStore";
import {settingsStore} from "./settingsStore";
import {proxy} from "valtio";
import dayjs, {Dayjs} from "dayjs";
import {toPath} from "../utils";
import {sortBy} from "remeda";

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
        const today = dayjs(new Date())
        return Object.entries(fileStore.files)
            .filter(it => {
                let filePath = toPath(it[0])
                // check for .icloud extension, which means the files exist but are not loaded locally yet
                const fileTypeMatches = filePath.extension === "icloud" ? toPath(filePath.filename).extension === settingsStore.fileType : filePath.extension === settingsStore.fileType
                const fileMatches = !!filePath.filename.match(settingsStore.dailyNotePattern)

                // TODO: should probs just refactor fileStore and strip the root dir from all paths
                const targetDir = toPath(settingsStore.chronoNotesDirectory).components.slice(1)
                const fileDir = filePath.components.slice(1)
                const dirMatches = fileDir.join("/").startsWith(targetDir.join("/"))
                return dirMatches && fileMatches && fileTypeMatches && it[1].kind === "file"
            })
            .filter(([path, _]) => {
                const p = toPath(path)
                const d = dayjs(p.filename)
                return d.isAfter(today.subtract(settingsStore.rollingViewLookbackDays, "day"))
            })
            .map(it => it[1] as FileNode)
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

// @ts-ignore
window.store = rootStore