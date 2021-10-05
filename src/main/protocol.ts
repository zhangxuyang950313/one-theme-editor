import path from "path";
import { URL } from "url";
import fse from "fs-extra";
import FileType from "file-type";
import { protocol } from "electron";
import { getImgBuffAndFileType } from "../common/utils";

import electronStore from "../common/electronStore";

export default function registerProtocol(): void {
  protocol.registerBufferProtocol("one", async (request, callback) => {
    const { pathname } = new URL(request.url);
    const data = fse.readFileSync(decodeURIComponent(pathname));
    const mimeType = (await FileType.fromBuffer(data))?.mime || "image/png";
    callback({ mimeType, data });
  });
  protocol.registerFileProtocol("local-resource", (request, callback) => {
    const url = request.url.replace(/^local-resource:\/\//, "file://");
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
  protocol.registerBufferProtocol("resource", async (request, response) => {
    try {
      const { hostname, pathname } = new URL(request.url);
      const root = electronStore.get("resourcePath");
      const file = decodeURIComponent(path.join(root, hostname, pathname));
      const { buff, fileType } = await getImgBuffAndFileType(file);
      response({ mimeType: fileType.mime, data: buff });
    } catch (err) {
      response({ mimeType: "image/png", data: Buffer.from("") });
    }
  });
  protocol.registerBufferProtocol("project", async (request, response) => {
    try {
      const { hostname, pathname } = new URL(request.url);
      const root = electronStore.get("projectPath");
      const file = decodeURIComponent(path.join(root, hostname, pathname));
      const { buff, fileType } = await getImgBuffAndFileType(file);
      response({ mimeType: fileType.mime, data: buff });
    } catch (err) {
      response({ mimeType: "image/png", data: Buffer.from("") });
    }
  });
  // 双向选择协议
  protocol.registerBufferProtocol("src", async (request, response) => {
    try {
      const { hostname, pathname } = new URL(request.url);
      const projectPath = electronStore.get("projectPath");
      let file = path.join(projectPath, hostname, pathname);
      if (!fse.existsSync(file)) {
        const resourcePath = electronStore.get("resourcePath");
        file = path.join(resourcePath, hostname, pathname);
      }
      const { buff, fileType } = await getImgBuffAndFileType(file);
      response({ mimeType: fileType.mime, data: buff });
    } catch (err) {
      response({ mimeType: "image/png", data: Buffer.from("") });
    }
  });
  // protocol.registerFileProtocol("one", (request, callback) => {
  //   console.log(request);
  //   const file = `file://${request.url.substr(6)}?t=${new Date().getTime()}`;
  //   console.log(file);
  //   callback({ path: path.normalize(file) });
  // });
}
