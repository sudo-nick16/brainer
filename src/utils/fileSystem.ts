let imagesDir: FileSystemDirectoryHandle | undefined = undefined;
let opfsDir: FileSystemDirectoryHandle | undefined = undefined;

export async function fileSystemInit() {
  try {
    opfsDir = await navigator.storage.getDirectory();
    imagesDir = await opfsDir.getDirectoryHandle('images', { create: true })
  } catch (err) {
    console.log("error: ", err);
  }
}

export async function saveImage(name: string, imageStr: string) {
  try {
    if (!opfsDir || !imagesDir) {
      await fileSystemInit();
      await saveImage(name, imageStr);
      return;
    }
    const fileHandle = await imagesDir.getFileHandle(name, { create: true });
    const stream = await fileHandle.createWritable({ keepExistingData: false });
    await stream.write(imageStr);
    await stream.close();
  } catch (err) {
    console.log("error: ", err);
  }
}

export async function loadImage(name: string): Promise<string> {
  try {
    if (!opfsDir || !imagesDir) {
      await fileSystemInit();
      const content = await loadImage(name);
      return content;
    }
    const fileHandle = await imagesDir.getFileHandle(name);
    const file = await fileHandle.getFile();
    const content = await file.text();
    return content;
  } catch (err) {
    console.log("error: ", err);
  }
  return "";
}

export async function removeImage(name: string) {
  try {
    if (!opfsDir || !imagesDir) {
      await fileSystemInit();
      await removeImage(name);
      return;
    }
    await imagesDir.removeEntry(name);
  } catch (err) {
    console.log("error: ", err);
  }
}

export async function clearFileSystem() {
  try {
    if (!opfsDir || !imagesDir) {
      await fileSystemInit();
      await clearFileSystem();
      return;
    }
    await opfsDir.removeEntry('images', { recursive: true });
    opfsDir = undefined;
    imagesDir = undefined;
  } catch (err) {
    console.log("error: ", err);
  }
}
