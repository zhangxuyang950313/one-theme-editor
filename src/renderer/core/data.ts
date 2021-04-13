import path from "path";
// import fse from "fs-extra";
import { remote } from "electron";
import Database from "nedb-promises";
import { TypeBrandInfo, TypeProjectData, TypeDatabase } from "@/types/project";
import { isDev } from "./constant";

const userDataPath = isDev
  ? path.resolve(remote.app.getAppPath(), "../userCache")
  : remote.app.getPath("userData");

const projectData = path.resolve(userDataPath, "store/project.db");
const imageData = path.resolve(userDataPath, "store/image.db");

const db: Record<any, Database> = {
  // 项目工程数据
  project: new Database({
    filename: projectData,
    autoload: true,
    timestampData: true
  }),
  // 图片
  image: new Database({
    filename: imageData,
    autoload: true,
    timestampData: false
  })
};

// export async function getImageByPath(
//   file: string
// ): Promise<TypeImageCache | null> {
//   if (!fse.existsSync(file)) return Promise.resolve(null);
//   if (!db.image) return Promise.resolve(null);
//   const getImg = async () => await db.image.findOne<TypeImageCache>({ file });
//   if (!(await getImg())) {
//     const base64 = await fse.readFile(file, "base64");
//     const extname = path.extname(file).replace(/^\./, "");
//     const imgBase64 = `data:image/${extname};base64,${base64}`;
//     await db.image.insert<TypeImageCache>({
//       file,
//       base64: imgBase64
//     });
//   }
//   // todo  if img === null
//   return getImg();
// }

// export async function getImageListByPaths(
//   fileList: string[]
// ): Promise<(TypeImageCache | null)[]> {
//   const queue = fileList.map(getImageByPath);
//   return Promise.all(queue);
// }

// 创建工程
export async function addProject(
  props: TypeProjectData
): Promise<TypeDatabase<TypeProjectData>> {
  return await db.project.insert(props);
}

// 获取所有工程
type TypeAllBrandProjects = {
  [x: string]: TypeProjectData[];
};
export async function getAllProjects(): Promise<
  TypeDatabase<TypeAllBrandProjects>[]
> {
  if (!db.project) return [];
  return await db.project.find<TypeAllBrandProjects>({});
}

// 获取对应厂商所有工程
export async function getProjectsByBrand(
  brandInfo: TypeBrandInfo
): Promise<TypeDatabase<TypeProjectData>[]> {
  if (!db.project) return [];
  const projects = await db.project.find<TypeProjectData>({ brandInfo });
  return projects.sort((a, b) => {
    if (a.updatedAt && b.updatedAt) {
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    } else return 0;
  });
}

// 通过 id 获取主题项目
export async function getProjectById(
  id: string
): Promise<TypeDatabase<TypeProjectData> | null> {
  if (!db.project) return null;
  return await db.project.findOne<TypeProjectData>({ _id: id });
}

// db.project?.remove({}, { multi: true });
