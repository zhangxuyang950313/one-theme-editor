import path from "path";
import { TypeBrandInfo } from "../types/project";

// 工程目录
export const PROJECTS_DIR = path.resolve(__dirname, "../userData/projects");

// 静态资源目录
export const STATIC_DIR = path.resolve(__dirname, "../static");

// 资源目录
export const RESOURCE_DIR = path.resolve(STATIC_DIR, "resource");

// 二进制目录
export const BINARY_DIR = path.resolve(RESOURCE_DIR, "binary");

// 模板目录
export const TEMPLATE_DIR = path.resolve(RESOURCE_DIR, "templates");

// 模板总配置文件
export const TEMPLATE_CONFIG = path.resolve(TEMPLATE_DIR, "config.xml");

// 获取对应机型的模板目录
export const getTempDirByBrand = (brandInfo: TypeBrandInfo): string => {
  return path.resolve(TEMPLATE_DIR, brandInfo.templateDir);
};
