import path from "path";

import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";

export interface CliConfigOptions {
  "config"?: string;
  "mode"?: webpack.Configuration["mode"];
  "env"?: string;
  "config-register"?: string;
  "configRegister"?: string;
  "config-name"?: string;
  "configName"?: string;
}

export type ConfigurationFactory = (
  env: string | Record<string, boolean | number | string> | undefined,
  args: CliConfigOptions
) => webpack.Configuration | Promise<webpack.Configuration>;

// webpack-dev-server@4.0.0.beta.0 类型补充
export type DevServerConfiguration = WebpackDevServer.Configuration & {
  dev?: { writeToDisk?: boolean; stats?: webpack.Configuration["stats"] };
};

// type MultiConfigurationFactory = (
//   env: string | Record<string, boolean | number | string> | undefined,
//   args: CliConfigOptions
// ) => webpack.Configuration[] | Promise<webpack.Configuration[]>;

export const rootDir = path.resolve(__dirname, "..");

export const entryFile = {
  main: path.resolve(rootDir, "src/main/index.ts"),
  preload: path.resolve(rootDir, "src/preload/index.ts"),
  cluster: path.resolve(rootDir, "src/main/cluster.ts"),
  // 单独打包 worker 脚本
  workers: {
    ninePatch: path.resolve(rootDir, "src/workers/nine-patch.ts")
  },
  render: {
    projectManager: path.resolve(
      rootDir,
      "src/renderer/views/project-manager/index.tsx"
    ),
    projectEditor: path.resolve(
      rootDir,
      "src/renderer/views/project-editor/index.tsx"
    )
  }
};

export const outputDir = {
  main: path.resolve(rootDir, "release.main"),
  render: path.resolve(rootDir, "release.renderer")
};

export const eslintConfigFile = path.resolve(rootDir, ".eslintrc.js");

export const WDS_SERVER_HOST = "localhost";

export const WDS_SERVER_PORT = 3000;

export const WDS_SOCKET_HOST = WDS_SERVER_HOST;

export const WDS_SOCKET_PORT = WDS_SERVER_PORT;

export const extensions = [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".d.ts",
  ".json",
  ".css",
  ".less",
  ".scss",
  ".frag"
];

export const alias = {
  src: path.resolve(rootDir, "src"),
  enum: path.resolve(rootDir, "src/enum"),
  data: path.resolve(rootDir, "src/data"),
  types: path.resolve(rootDir, "src/types"),
  common: path.resolve(rootDir, "src/common"),
  main: path.resolve(rootDir, "src/main"),
  renderer: path.resolve(rootDir, "src/renderer")
};
