// subscriptions

import {readDir, resolveFiles} from "./utils";
import {proxy, ref} from "valtio";
import {derive} from "valtio/utils";

type DirNode = { path: string, kind: "directory" }
type FileNode = { path: string, kind: "file" }
type FSNode = DirNode | FileNode
type State = typeof state

// model
export const state = proxy({
    loadingState: "NONE" as "NONE" | "LOADING" | "DONE",
    selectedFilePath: "",
    rootDirHandle: null as FileSystemDirectoryHandle | null,
    _fileHandleCache: ref({} as { [key: string]: FileSystemFileHandle | FileSystemDirectoryHandle }),
    files: {} as { [key: string]: FSNode },

    get selectedFile(): FSNode | null {
        const id = state.selectedFilePath
        return state.files[id] ?? null
    },

    async selectedFileContent(): Promise<string | null> {
        const p = state.selectedFilePath
        return p ? await fetchFileContentByPath(p) : null
    }
})

// views
export const derived = derive({
    selectedFileContent: async (get): Promise<string | null> => {
        const p = get(state).selectedFilePath
        return p ? await fetchFileContentByPath(p) : null
    }
})

// async views
export const fetchFileHandle = async (id: string): Promise<FileSystemFileHandle | FileSystemDirectoryHandle | null> => {
    if (state._fileHandleCache[id]) {
        return state._fileHandleCache[id]
    }
    const node = state.files[id]
    let res = null
    if (node?.kind === "directory") {
        // TODO: this method doesn't really seem to work. Might need to actually recurse down to the file
        res = await state.rootDirHandle?.getDirectoryHandle(id) ?? null
    } else if (node?.kind === "file") {
        // console.log("file??", id, node)
        // TODO: this method doesn't really seem to work. Might need to actually recurse down to the file
        res = await state.rootDirHandle?.getFileHandle(id) ?? null
    }
    // cache fileHandle
    res !== null && (state._fileHandleCache[id] = res)
    return res
}

export const fetchFileContent = async (file: FileSystemFileHandle): Promise<string> => {
    const f = await file.getFile()
    return await f.text()
}

export const fetchFileContentByPath = async (path: string): Promise<string | null> => {
    const f = await fetchFileHandle(path)
    if (f instanceof FileSystemFileHandle) {
        return await fetchFileContent(f);
    } else {
        return null
    }
}

// actions
export const setSelectedFile = (path: string): void => {
    state.selectedFilePath = path
}


// async actions
export const initApp = async () => {
    await setRootDirHandleAndPopulateFilenameCache()
}

const setRootDirHandleAndPopulateFilenameCache = async () => {
    state.loadingState = "LOADING"
    const rootDir = await readDir()
    state.loadingState = "DONE"
    state.rootDirHandle = rootDir
    state._fileHandleCache[rootDir.name] = rootDir
    const resolveRecurse = async (fPath: string, f: FileSystemDirectoryHandle) => {
        const childs = await resolveFiles(f)
        for (const it of childs) {
            const p = fPath + "/" + it.name
            state.files[p] = {path: p, kind: it.kind} as FSNode
            if (it instanceof FileSystemDirectoryHandle || it instanceof FileSystemFileHandle) {
                state._fileHandleCache[p] = it
            }
            if (it instanceof FileSystemDirectoryHandle) {
                await resolveRecurse(p, it)
            }
        }
    }

    await resolveRecurse(rootDir.name, rootDir)
}

// @ts-ignore
window.state = state