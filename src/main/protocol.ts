import path from "path";
import { URL } from "url";

import fse from "fs-extra";
import { protocol, app, nativeImage, ResizeOptions } from "electron";
import PathUtil from "src/common/utils/PathUtil";
import reactiveState from "src/common/singletons/reactiveState";
import { fileBufferCache } from "src/main/singletons/fileCache";

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
): Promise<{ mimeType: string; data: Buffer }> {
  let file = "";
  const options: Required<ResizeOptions> = {
    width: 0,
    height: 0,
    // `good`, `better`, * or `best`
    quality: "best"
  };
  const result = await new Promise<{ mimeType: string; data: Buffer }>(
    async resolve => {
      try {
        const { hostname, pathname, searchParams } = new URL(url);
        options.width = Number(searchParams.get("w") || 0);
        options.height = Number(searchParams.get("h") || 0);
        options.quality = searchParams.get("q") || "best";
        file = decodeURIComponent(path.join(root, hostname, pathname));
        if (!fse.existsSync(file)) {
          // 如果获取不到的备份
          if (backupRoot) {
            const data = await getFilePicResponseData(url, backupRoot);
            resolve(data);
          } else {
            throw new Error(`${file} is not exists`);
          }
        }
        // 获取图片数据
        const data = await fileBufferCache.getMimeTypedBuffer(file);
        resolve(data);
      } catch (err) {
        console.log(err);
        const def = { mimeType: "image/png", data: Buffer.from("") };
        // 不存在空返回
        if (!fse.existsSync(file)) {
          resolve(def);
        } else {
          // 否则使用图标
          const data = await getFileIconData(file).catch(() => def);
          resolve(data);
        }
      }
    }
  );
  // 需要重设尺寸
  if (options.width || options.height) {
    options.width = Math.floor(options.width);
    options.height = Math.floor(options.height);

    const image = nativeImage.createFromBuffer(result.data).resize(options);
    switch (result.mimeType) {
      case "image/jpeg": {
        result.data = image.toJPEG(100);
        break;
      }
      case "image/png":
      default: {
        result.data = image.toPNG();
        break;
      }
    }
  }
  return result;
}

export default function registerProtocol(): void {
  console.log("注册协议");
  // protocol.registerFileProtocol("local-resource", (request, callback) => {
  //   const url = request.url.replace(/^local-resource:/, "file:");
  //   // Decode URL to prevent errors when loading filenames with UTF-8 chars or chars like "#"
  //   const decodedUrl = decodeURI(url); // Needed in case URL contains spaces
  //   console.log(decodedUrl);
  //   try {
  //     return callback(decodedUrl);
  //   } catch (error) {
  //     console.error(
  //       "ERROR: registerLocalResourceProtocol: Could not get file path:",
  //       error
  //     );
  //   }
  // });

  protocol.registerBufferProtocol("app", (request, respond) => {
    let pathName = new URL(request.url).pathname;
    pathName = decodeURI(pathName); // Needed in case URL contains spaces

    fse.readFile(path.join(app.getAppPath(), pathName), (error, data) => {
      if (error) {
        console.error(`Failed to read ${pathName} on app protocol`, error);
      }
      const extension = path.extname(pathName).toLowerCase();
      let mimeType = "";

      if (extension === ".js") {
        mimeType = "text/javascript";
      } else if (extension === ".html") {
        mimeType = "text/html";
      } else if (extension === ".css") {
        mimeType = "text/css";
      } else if (extension === ".svg" || extension === ".svgz") {
        mimeType = "image/svg+xml";
      } else if (extension === ".json") {
        mimeType = "application/json";
      } else if (extension === ".wasm") {
        mimeType = "application/wasm";
      }

      respond({ mimeType, data });
    });
  });

  protocol.registerBufferProtocol("local", async (request, response) => {
    const data = await getFilePicResponseData(request.url, "");
    response(data);
  });

  // 根路径为资源路径
  protocol.registerBufferProtocol("resource", async (request, response) => {
    const data = await getFilePicResponseData(
      request.url,
      reactiveState.get("resourcePath")
    );
    response(data);
  });

  // 根路径为工程路径
  protocol.registerBufferProtocol("project", async (request, response) => {
    const data = await getFilePicResponseData(
      request.url,
      reactiveState.get("projectPath")
    );
    response(data);
  });

  // 双向选择协议
  protocol.registerBufferProtocol("src", async (request, response) => {
    const data = await getFilePicResponseData(
      request.url,
      reactiveState.get("projectPath"),
      reactiveState.get("resourcePath")
    );
    response(data);
  });

  protocol.registerBufferProtocol("thumbnail", async (request, response) => {
    // let uuid = new URL(request.url).hostname;
    // uuid = decodeURI(uuid); // Needed in case URL contains spaces
    const data = await getFilePicResponseData(
      request.url,
      PathUtil.PROJECT_THUMBNAIL_DIR
    );
    response(data);
  });
  // protocol.registerFileProtocol("one", (request, callback) => {
  //   console.log(request);
  //   const file = `file://${request.url.substr(6)}?t=${new Date().getTime()}`;
  //   console.log(file);
  //   callback({ path: path.normalize(file) });
  // });
}
