let imagesDir: FileSystemDirectoryHandle | undefined = undefined;
let opfsDir: FileSystemDirectoryHandle | undefined = undefined;

export function fileSystemInit() {
    return new Promise<FileSystemDirectoryHandle>((resolve, reject) => {
        navigator.storage.getDirectory()
            .then(root => {
                opfsDir = root;
                return root.getDirectoryHandle("images", { create: true })
                    .then(dir => {
                        imagesDir = dir
                        resolve(dir);
                    });
            }).catch(error => {
                reject(error);
            });
    })
}

export function saveFileToFileSystem(name: string, imageStr: string) {
    return new Promise<void>((resolve, reject) => {
        const writeFile = () => {
            return imagesDir!.removeEntry(name).then(() => {
                return imagesDir!.getFileHandle(name, { create: true }).then(fileHandle => {
                    return fileHandle.createWritable({ keepExistingData: false }).then(stream => {
                        return stream.write(imageStr).then(() => {
                            stream.close();
                            resolve();
                        }).catch((e) => {
                            stream.close();
                            throw e;
                        })
                    })
                })
            })
        }

        if (imagesDir === undefined) {
            fileSystemInit().then(() => {
                return writeFile().catch(error => {
                    reject(error);
                })
            })
            return;
        }
        return writeFile().catch(error => {
            reject(error);
        })

    })
}


export function loadImage(name: string) {
    return new Promise<string>((resolve, reject) => {
        const readFile = () => {
            return imagesDir!.getFileHandle(name).then(fileHandle => {
                return fileHandle.getFile()
            }).then(file => file.text()).then(data => resolve(data));
        }
        if (imagesDir === undefined) {
            fileSystemInit().then(() => {
                return readFile().catch(error => {
                    reject(error);
                })
            })
            return;
        }
        return readFile().catch(error => {
            reject(error);
        })
    })
}

export function removeImage(name: string) {
    return new Promise<void>((resolve, reject) => {
        const rm = () => {
            return imagesDir!.removeEntry(name).then(() => resolve());
        }
        if (imagesDir === undefined) {
            fileSystemInit().then(() => {
                return rm().catch(error => {
                    reject(error);
                })
            })
            return;
        }
        return rm().catch(error => {
            reject(error);
        })
    })
}

export function clearFileSystem() {
    return new Promise<void>((resolve, reject) => {
        const clear = () => {
            return opfsDir!.removeEntry("images", { recursive: true }).then(() => {
                opfsDir = undefined;
                imagesDir = undefined;
                resolve();
            })
        }
        if (opfsDir === undefined) {
            fileSystemInit().then(() => {
                return clear().catch((e) => {
                    reject(e);
                })
            })
            return;
        }
        return clear().catch((e) => {
            reject(e);
        })
    })
}
