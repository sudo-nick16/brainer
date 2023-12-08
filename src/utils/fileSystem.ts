let imagesDir: FileSystemDirectoryHandle | undefined = undefined;
let opfsDir: FileSystemDirectoryHandle | undefined = undefined;

export async function fileSystemInit() {
  opfsDir = await navigator.storage.getDirectory();
  imagesDir = await opfsDir.getDirectoryHandle('images', { create: true })
}

export async function saveImage(name: string, imageStr: string) {
  if (!opfsDir || !imagesDir) {
    await fileSystemInit();
    await saveImage(name, imageStr);
    return;
  }
  const fileHandle = await imagesDir.getFileHandle(name, { create: true });
  const stream = await fileHandle.createWritable({ keepExistingData: false });
  await stream.write(imageStr);
  await stream.close();
}


export async function loadImage(name: string): Promise<string> {
  if (!opfsDir || !imagesDir) {
    await fileSystemInit();
    const content = await loadImage(name);
    return content;
  }
  const fileHandle = await imagesDir.getFileHandle(name);
  const file = await fileHandle.getFile();
  const content = await file.text();
  return content;
}

export async function removeImage(name: string) {
  if (!opfsDir || !imagesDir) {
    await fileSystemInit();
    await removeImage(name);
    return;
  }
  await imagesDir.removeEntry(name);
}

export async function clearFileSystem() {
  if (!opfsDir || !imagesDir) {
    await fileSystemInit();
    await clearFileSystem();
    return;
  }
  await opfsDir.removeEntry('images', { recursive: true });
  opfsDir = undefined;
  imagesDir = undefined;
}
