import { URL } from "url";
import { protocol } from "electron";
import fse from "fs-extra";
import FileType from "file-type";

export default function registerProtocol(): void {
  protocol.registerBufferProtocol("one", async (request, callback) => {
    const { pathname } = new URL(request.url);
    const data = fse.readFileSync(pathname);
    const mimeType = (await FileType.fromBuffer(data))?.mime || "image/png";
    callback({ mimeType, data });
  });
  // protocol.registerFileProtocol("one", (request, callback) => {
  //   console.log(request);
  //   const file = `file://${request.url.substr(6)}?t=${new Date().getTime()}`;
  //   console.log(file);
  //   callback({ path: path.normalize(file) });
  // });
}
