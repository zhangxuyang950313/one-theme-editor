import {
  TypeBrandInfo,
  TypeImageData,
  TypePageConfData,
  TypePreviewData,
  TypeProjectData,
  TypeProjectInfo,
  TypeTemplateConf,
  TypeTempUiVersionConf
} from "@/types/project";
import { addProject } from "./data";
import { compilePreviewData } from "./template-compiler";
import { arrayToMapByKey } from "./utils";

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
};

type TypeImageDataMap = { [x: string]: TypeImageData };

type TypePageConfDataMap = { [x: string]: TypePageConfData };

// new 完之后一定要先调用 setUp 或者 create
export default class Project {
  public isInitialized!: boolean;
  // 厂商信息
  private brandInfo!: TypeBrandInfo;
  // 主题描述信息
  private projectInfo!: TypeProjectInfo;
  // 模板配置
  private templateConf!: TypeTemplateConf;
  // 预览配置列表
  private previewData!: TypePreviewData;
  // 提供图片数据索引
  private imageDataMap!: TypeImageDataMap;
  // 提供页面配置数据索引
  private pageConfMap!: TypePageConfDataMap;

  constructor() {
    this.isInitialized = false;
  }

  // 从现有数据安装主题
  public setup(props: TypeSetUpProps): TypeProjectData {
    this.brandInfo = props.brandInfo;
    this.projectInfo = props.projectInfo;
    this.templateConf = props.templateConf;
    this.previewData = props.previewData;
    // 生成数据索引
    this.imageDataMap = arrayToMapByKey(props.previewData.imageData, "key");
    this.pageConfMap = arrayToMapByKey(props.previewData.pageConfData, "key");
    this.isInitialized = true;
    return props;
  }

  // 从模板创建主题
  // 和现有数据不同的是，从模板创建主题是要解析模板数据配合版本进行初始化的，而数据是初始化后的储存
  public async create(props: TypeCreateProps): Promise<TypeProjectData> {
    const data: TypeProjectData = {
      brandInfo: props.brandInfo,
      projectInfo: props.projectInfo,
      templateConf: props.templateConf,
      previewData: await compilePreviewData(
        props.templateConf,
        props.uiVersion?.src || ""
      )
    };
    this.setup(data);
    return data;
  }

  // 保存到磁盘
  public async save(): Promise<TypeProjectData> {
    // 写入数据库
    return addProject({
      brandInfo: this.brandInfo,
      projectInfo: this.projectInfo,
      templateConf: this.templateConf,
      previewData: this.previewData
    });
  }

  // 使用 key 获取图片 base64
  public getBase64ByKey(key: string): string {
    return this.imageDataMap[key]?.base64 || "";
  }

  // 使用 key 获取页面配置
  public getPageConfByKey(key: string): TypePageConfData | null {
    return this.pageConfMap[key] || null;
  }
}
