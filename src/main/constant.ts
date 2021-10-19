import path from "path";
import electron from "electron";

function resolvePath(src: string) {
  return path.join(electron.app.getAppPath(), isDev ? ".." : "", src);
}

export const isDev = process.env.NODE_ENV !== "production";

export const devtoolsPath = path.resolve(
  process.cwd(),
  "devtools/8921.104.0.3_0"
);

export const htmlFile = resolvePath("release.renderer/index.html");

export const serverFile = resolvePath("release.server/index.js");

export const localUrl = `http://localhost:${
  process.env.WDS_SERVER_PORT || 3000
}`;

const prefix = isDev ? localUrl : htmlFile;

export const getUrl = {
  starter(): string {
    return `${prefix}#/starter`;
  },
  createProject(scenarioSrc: string): string {
    return `${prefix}#/create-project?scenarioSrc=${scenarioSrc}`;
  },
  projectEditor(uuid: string): string {
    return `${prefix}#/project-editor/${uuid}`;
  }
};
