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

export const reactOutputDir = path.resolve(rootDir, "release.renderer");
export const electronOutputDir = path.resolve(rootDir, "release.main");
export const serverOutputDir = path.resolve(rootDir, "release.server");

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
