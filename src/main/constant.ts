import path from "path";
import { app } from "electron";

export const isDev = process.env.NODE_ENV !== "production";

export const devtoolsPath = path.resolve(
  process.cwd(),
  "devtools/8921.104.0.3_0"
);

export const htmlFile = path.join(
  app.getAppPath(),
  isDev ? ".." : "",
  "release.renderer/index.html"
);
