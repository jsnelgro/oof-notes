import {derive} from "valtio/utils";
import {readDir, resolveFiles} from "./services/filesystem-service";
import {proxy, ref} from "valtio";

export type DirNode = { path: string, name: string, kind: "directory", children?: FSNode[] }
export type FileNode = { path: string, name: string, kind: "file" }
export type FSNode = DirNode | FileNode

function FileStore() {
// model
    const state = proxy({
        loadingState: "NONE" as "NONE" | "LOADING" | "DONE",
        selectedFilePath: "",
        rootDirHandle: null as FileSystemDirectoryHandle | null,
        _fileHandleCache: ref({} as { [key: string]: FileSystemFileHandle | FileSystemDirectoryHandle }),
        // TODO: these need to stay in sync... not great. Should derive and memoize the files hashtable
        filesAsTree: null as DirNode | null,
        files: {} as { [key: string]: FSNode },

        get selectedFile(): FSNode | null {
            const id = state.selectedFilePath
            return state.files[id] ?? null
        },

        async selectedFileContent(): Promise<string | null> {
            const p = state.selectedFilePath
            return p ? await state.fetchFileContentByPath(p) : null
        },
// views
        derived: derive({
            selectedFileContent: async (get): Promise<string | null> => {
                const p = get(state).selectedFilePath
                return p ? await state.fetchFileContentByPath(p) : null
            }
        }),
// async views
        fetchFileHandle: async (id: string): Promise<FileSystemFileHandle | FileSystemDirectoryHandle | null> => {
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
        },
        fetchFileContent: async (file: FileSystemFileHandle): Promise<string> => {
            const f = await file.getFile()
            return await f.text()
        },
        fetchFileContentByPath: async (path: string): Promise<string | null> => {
            const f = await state.fetchFileHandle(path)
            if (f instanceof FileSystemFileHandle) {
                return await state.fetchFileContent(f);
            } else {
                return null
            }
        },
// actions
        setSelectedFile: (path: string): void => {
            state.selectedFilePath = path
        },
// async actions
        init: async () => {
            await state.setRootDirHandleAndPopulateFilenameCache()
        },
        setRootDirHandleAndPopulateFilenameCache: async () => {
            state.loadingState = "LOADING"
            const rootDir = await readDir()
            state.loadingState = "DONE"
            state.rootDirHandle = rootDir
            state._fileHandleCache[rootDir.name] = rootDir
            const resolveRecurse = async (fPath: string, f: FileSystemDirectoryHandle, parent: DirNode): Promise<FSNode> => {
                const childs = await resolveFiles(f)
                const childRefs: FSNode[] = await Promise.all(childs.map(async it => {
                    const c = {path: fPath + "/" + it.name, name: it.name, kind: it.kind} as FSNode
                    if (it instanceof FileSystemDirectoryHandle || it instanceof FileSystemFileHandle) {
                        state.files[c.path] = c
                        state._fileHandleCache[c.path] = it
                    }

                    if (it instanceof FileSystemDirectoryHandle) {
                        return await resolveRecurse(c.path, it, c as DirNode)
                    } else {
                        return c
                    }
                }))
                return {...parent, children: childRefs}
            }

            state.filesAsTree = await resolveRecurse(rootDir.name, rootDir, {
                path: rootDir.name,
                name: rootDir.name,
                kind: rootDir.kind,
                children: []
            }) as DirNode
        },
    })

    return state
}

export const state = FileStore()
export default state