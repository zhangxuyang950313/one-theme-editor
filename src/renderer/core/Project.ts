import {
  TypeBrandInfo,
  TypePreviewData,
  TypeProjectData,
  TypeProjectInfo,
  TypeTemplateConf,
  TypeTempUiVersionConf
} from "@/types/project";
import { addProject } from "./data";
import { compilePreviewData } from "./template-compiler";

type TypePropsNormalized = {
  brandInfo: TypeBrandInfo;
  projectInfo: TypeProjectInfo;
  templateConf: TypeTemplateConf;
};

type TypeCreateProps = TypePropsNormalized & {
  uiVersion: TypeTempUiVersionConf | undefined;
};

type TypeSetUpProps = TypePropsNormalized & {
  previewData: TypePreviewData;
  projectResource: any;
};

export default class Project {
  // 厂商信息
  brandInfo?: TypeBrandInfo;
  // 主题描述信息
  projectInfo?: TypeProjectInfo;
  // 模板配置
  templateConf?: TypeTemplateConf;
  // 预览配置列表
  previewData?: TypePreviewData;
  // 主题数据
  projectResource?: any;

  // 从现有数据安装主题
  async setUp(props: TypeSetUpProps): Promise<TypeProjectData> {
    this.brandInfo = props.brandInfo;
    this.projectInfo = props.projectInfo;
    this.templateConf = props.templateConf;
    this.previewData = props.previewData;
    this.projectResource = props.projectResource;
    // 创建主题，写入数据库
    return addProject(props);
  }

  // 从模板创建主题
  // 和现有数据不同的是，从模板创建主题是要解析模板数据配合版本进行初始化的，而数据是初始化后的储存
  async create(props: TypeCreateProps): Promise<TypeProjectData> {
    const data = {
      brandInfo: props.brandInfo,
      projectInfo: props.projectInfo,
      templateConf: props.templateConf,
      previewData: await compilePreviewData(
        props.templateConf,
        props.uiVersion?.src || ""
      ),
      projectResource: {}
    };
    return this.setUp(data);
  }
}
