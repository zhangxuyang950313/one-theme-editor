import path from "path";
import { app } from "electron";
import { TypeScenarioOption } from "src/types/scenario.config";
import { WDS_SERVER_HOST, WDS_SERVER_PORT } from "../../webpack/constant";

function resolvePath(src: string) {
  return path.join(app.getAppPath(), "..", src);
}

export const isDev = process.env.NODE_ENV !== "production";

export const devtoolsPath = path.resolve(
  process.cwd(),
  "devtools/8921.104.0.3_0"
);

export const rendererDir = resolvePath("release.renderer");

export const preloadFile = resolvePath("release.main/preload.js");

export const localUrl = `http://${WDS_SERVER_HOST}:${WDS_SERVER_PORT}`;

const prefix = isDev ? localUrl : `app://./release.renderer`;

export const getUrl = {
  starter(): string {
    return `${prefix}/starter.html`;
  },
  createProject(scenarioOption: TypeScenarioOption): string {
    return `${prefix}/create-project.html?scenarioSrc=${scenarioOption.src}&scenarioName=${scenarioOption.name}`;
  },
  projectEditor(uuid: string): string {
    return `${prefix}/project-editor.html?uuid=${uuid}`;
  }
};
