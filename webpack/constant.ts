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
  main: {
    dev: path.resolve(rootDir, "src/main/index.dev.ts"),
    pro: path.resolve(rootDir, "src/main/index.ts")
  },
  server: path.resolve(rootDir, "src/server/index.ts"),
  render: path.resolve(rootDir, "src/renderer/index.tsx")
};

export const outputDir = {
  main: path.resolve(rootDir, "release.main"),
  server: path.resolve(rootDir, "release.server"),
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
  ".scss"
];

export const alias = {
  src: path.resolve(rootDir, "src"),
  enum: path.resolve(rootDir, "src/enum"),
  data: path.resolve(rootDir, "src/data"),
  types: path.resolve(rootDir, "src/types"),
  common: path.resolve(rootDir, "src/common"),
  server: path.resolve(rootDir, "src/server"),
  renderer: path.resolve(rootDir, "src/renderer")
};
