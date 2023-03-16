// subscriptions

import {pickRootDirHandle, resolveFiles} from "./services/filesystem-service";
import {proxy, ref} from "valtio";
import {derive} from "valtio/utils";

export type DirNode = { path: string, name: string, kind: "directory", children?: FSNode[] }
export type FileNode = { path: string, name: string, kind: "file" }
export type FSNode = DirNode | FileNode
// type State = typeof state

// model
export const fileStore = proxy({
    loadingState: "NONE" as "NONE" | "LOADING" | "DONE",
    selectedFilePath: "",
    rootDirHandle: null as FileSystemDirectoryHandle | null,
    _fileHandleCache: ref({} as { [key: string]: FileSystemFileHandle | FileSystemDirectoryHandle }),
    // TODO: these need to stay in sync... not great. Should derive and memoize the files hashtable
    filesAsTree: null as DirNode | null,
    files: {} as { [key: string]: FSNode },

    get selectedFile(): FSNode | null {
        const id = fileStore.selectedFilePath
        return fileStore.files[id] ?? null
    },

    async selectedFileContent(): Promise<string | null> {
        const p = fileStore.selectedFilePath
        return p ? await fetchFileContentByPath(p) : null
    }
})

// views
export const derived = derive({
    selectedFileContent: async (get): Promise<string | null> => {
        const p = get(fileStore).selectedFilePath
        return p ? await fetchFileContentByPath(p) : null
    }
})

// async views
export const fetchFileHandle = async (id: string): Promise<FileSystemFileHandle | FileSystemDirectoryHandle | null> => {
    if (fileStore._fileHandleCache[id]) {
        return fileStore._fileHandleCache[id]
    }
    const node = fileStore.files[id]
    let res = null
    if (node?.kind === "directory") {
        // TODO: this method doesn't really seem to work. Might need to actually recurse down to the file
        res = await fileStore.rootDirHandle?.getDirectoryHandle(id) ?? null
    } else if (node?.kind === "file") {
        // TODO: this method doesn't really seem to work. Might need to actually recurse down to the file
        res = await fileStore.rootDirHandle?.getFileHandle(id) ?? null
    }
    // cache fileHandle
    res !== null && (fileStore._fileHandleCache[id] = res)
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
    fileStore.selectedFilePath = path
}

// async actions
export const init = async () => {
    await setRootDirHandleAndPopulateFilenameCache()
}

const setRootDirHandleAndPopulateFilenameCache = async () => {
    fileStore.loadingState = "LOADING"
    const rootDir = await pickRootDirHandle("readwrite")
    fileStore.loadingState = "DONE"
    fileStore.rootDirHandle = rootDir
    fileStore._fileHandleCache[rootDir.name] = rootDir
    const resolveRecurse = async (fPath: string, f: FileSystemDirectoryHandle, parent: DirNode): Promise<FSNode> => {
        const childs = await resolveFiles(f)
        const childRefs: FSNode[] = await Promise.all(childs.map(async it => {
            const c = {path: fPath + "/" + it.name, name: it.name, kind: it.kind} as FSNode
            if (it instanceof FileSystemDirectoryHandle || it instanceof FileSystemFileHandle) {
                fileStore.files[c.path] = c
                fileStore._fileHandleCache[c.path] = it
            }

            if (it instanceof FileSystemDirectoryHandle) {
                return await resolveRecurse(c.path, it, c as DirNode)
            } else {
                return c
            }
        }))
        return {...parent, children: childRefs}
    }

    fileStore.filesAsTree = await resolveRecurse(rootDir.name, rootDir, {
        path: rootDir.name,
        name: rootDir.name,
        kind: rootDir.kind,
        children: []
    }) as DirNode
}
