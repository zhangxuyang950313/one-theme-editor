import { URL } from "url";
import { protocol } from "electron";
import fse from "fs-extra";
import FileType from "file-type";

export default function registerProtocol(): void {
  protocol.registerBufferProtocol("one", async (request, callback) => {
    const { pathname } = new URL(request.url);
    const data = fse.readFileSync(decodeURIComponent(pathname));
    const mimeType = (await FileType.fromBuffer(data))?.mime || "image/png";
    callback({ mimeType, data });
  });
  protocol.registerFileProtocol("local-resource", (request, callback) => {
    const url = request.url.replace(/^local-resource:\/\//, "");
    // Decode URL to prevent errors when loading filenames with UTF-8 chars or chars like "#"
    const decodedUrl = decodeURI(url); // Needed in case URL contains spaces
    try {
      return callback(decodedUrl);
    } catch (error) {
      console.error(
        "ERROR: registerLocalResourceProtocol: Could not get file path:",
        error
      );
    }
  });
  // protocol.registerFileProtocol("one", (request, callback) => {
  //   console.log(request);
  //   const file = `file://${request.url.substr(6)}?t=${new Date().getTime()}`;
  //   console.log(file);
  //   callback({ path: path.normalize(file) });
  // });
}
