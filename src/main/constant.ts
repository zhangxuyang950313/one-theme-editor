import { URL } from "url";
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
  projectManager(): string {
    return `${prefix}/project-manager.html`;
  },
  projectEditor(uuid: string): string {
    const url = new URL(`${prefix}/project-editor.html`);
    url.searchParams.append("uuid", uuid);
    return url.toString();
  },
  /**
   * @deprecated
   * @param scenarioOption
   * @returns
   */
  createProject(scenarioOption: TypeScenarioOption): string {
    const url = new URL(`${prefix}/create-project.html`);
    url.searchParams.append("scenarioSrc", scenarioOption.src);
    url.searchParams.append("scenarioName", scenarioOption.name);
    return url.toString();
  }
};
