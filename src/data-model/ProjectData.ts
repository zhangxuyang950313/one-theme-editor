import { TypeProjectData } from "./../types/project.d";
import UiVersion from "./UiVersion";
import ProjectInfo from "./ProjectInfo";
import BrandInfo from "./BrandInfo";

export default class ProjectData implements TypeProjectData {
  uuid = "";
  brandInfo = new BrandInfo();
  projectPathname = "";
  projectInfo = new ProjectInfo();
  uiVersion = new UiVersion();
  sourceConfigUrl = "";
  _id = "";
  createAt = "";
  updateAt = "";
}
