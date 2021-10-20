import path from "path";
import { URL } from "url";
import fse from "fs-extra";
import { protocol, app, nativeImage } from "electron";
import { getImgBuffAndFileType } from "../common/utils";

import electronStore from "../common/electronStore";

async function getFileIconData(file: string) {
  const data = await app.getFileIcon(file);
  return { mimeType: "image/png", data: data.toPNG() };
}

/**
 * 图片协议 responseData
 * @param url 要解析的 url
 * @param root 首选根目录
 * @param backupRoot 备选目录
 * @returns
 */
async function getFilePicResponseData(
  url: string,
  root: string,
  backupRoot?: string
) {
  let file = "";
  const options = {
    width: 0,
    height: 0,
    // `good`, `better`, * or `best`
    quality: "good"
  };
  const data = await new Promise<{ mimeType: string; data: Buffer }>(
    async resolve => {
      try {
        const { hostname, pathname, searchParams } = new URL(url);
        options.width = Number(searchParams.get("w") || 0);
        options.height = Number(searchParams.get("h") || 0);
        options.quality = searchParams.get("q") || "good";
        file = decodeURIComponent(path.join(root, hostname, pathname));
        if (!fse.existsSync(file)) {
          if (backupRoot) {
            const data = await getFilePicResponseData(url, backupRoot);
            resolve(data);
          } else {
            throw new Error(`${file} is not exists`);
          }
        }
        const { buff, fileType } = await getImgBuffAndFileType(file);
        resolve({ mimeType: fileType.mime, data: buff });
      } catch (err) {
        const def = {
          mimeType: "image/png",
          data: Buffer.from("")
        };
        if (!fse.existsSync(file)) {
          resolve(def);
        }
        const data = await getFileIconData(file).catch(() => def);
        resolve(data);
      }
    }
  );
  if (options.width * options.height) {
    const image = nativeImage.createFromBuffer(data.data).resize(options);
    switch (data.mimeType) {
      case "image/jpeg": {
        data.data = image.toJPEG(1);
        break;
      }
      case "image/png":
      default: {
        data.data = image.toPNG();
        break;
      }
    }
  }
  return data;
}

export default function registerProtocol(): void {
  console.log("注册协议");
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
    const root = electronStore.get("resourcePath");
    const data = await getFilePicResponseData(request.url, root);
    response(data);
  });

  protocol.registerBufferProtocol("project", async (request, response) => {
    const root = electronStore.get("projectPath");
    const data = await getFilePicResponseData(request.url, root);
    response(data);
  });

  // 双向选择协议
  protocol.registerBufferProtocol("src", async (request, response) => {
    const projectPath = electronStore.get("projectPath");
    const resourcePath = electronStore.get("resourcePath");
    const data = await getFilePicResponseData(
      request.url,
      projectPath,
      resourcePath
    );
    response(data.data);
  });
  // protocol.registerFileProtocol("one", (request, callback) => {
  //   console.log(request);
  //   const file = `file://${request.url.substr(6)}?t=${new Date().getTime()}`;
  //   console.log(file);
  //   callback({ path: path.normalize(file) });
  // });
}
