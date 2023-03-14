export async function readFile(fileHandle: FileSystemFileHandle) {
    const file = await fileHandle.getFile()
    const content = await file.text()
    return {fileHandle, content}
}

export async function newFile() {
    const options = {
        types: [
            {
                description: "Test files",
                accept: {
                    "text/plain": [".md"],
                },
            },
        ],
    };

    const handle = await window.showSaveFilePicker(options);
    const writable = await handle.createWritable();

    await writable.write("Hello World! " + Math.random());
    await writable.close();

    return handle;
}

export async function overwriteFile(fileHandle: FileSystemFileHandle, contents: string) {
    const writable = await fileHandle.createWritable();
    await writable.write(contents);
    await writable.close();
    return fileHandle;
}

export async function readDir(): Promise<FileSystemDirectoryHandle> {
    return await window.showDirectoryPicker();
}

export async function resolveFiles(handle?: FileSystemDirectoryHandle): Promise<FileSystemHandle[]> {
    if (!handle) {
        return []
    }
    const res = []
    for await (const entry of handle.values()) {
        res.push(entry)
    }
    return res;
}

export const uuid = (t = 21) => crypto.getRandomValues(new Uint8Array(t)).reduce(((t, e) => t += (e &= 63) < 36 ? e.toString(36) : e < 62 ? (e - 26).toString(36).toUpperCase() : e > 62 ? "-" : "_"), "");