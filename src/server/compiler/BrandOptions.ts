import md5 from "md5";
import fse from "fs-extra";
import {
  TypeApplyConf,
  TypeBrandConf,
  TypeBrandOption,
  TypePackConf
} from "src/types/source";
import { ELEMENT_TAG } from "src/enum/index";
import BrandConfig from "src/data/BrandConfig";
import XmlTemplate from "server/compiler/XmlTemplate";
import XmlFileCompiler from "server/compiler/XmlFileCompiler";
import pathUtil from "server/utils/pathUtil";
import ERR_CODE from "src/common/errorCode";
import BrandOption from "src/data/BrandOption";
import BrandConfigCompiler from "./BrandConfig";
import XMLNodeElement from "./XMLNodeElement";

export default class BrandOptions extends XmlTemplate {
  // 从文件创建实例
  static from(file: string): BrandOptions {
    const element = new XmlFileCompiler(file).getElement();
    return new BrandOptions(element);
  }

  // 读取品牌配置列表
  static readBrandOptions(): TypeBrandOption[] {
    if (!fse.existsSync(pathUtil.SOURCE_CONFIG_FILE)) {
      throw new Error(ERR_CODE[4003]);
    }
    return BrandOptions.from(pathUtil.SOURCE_CONFIG_FILE).getOptions();
  }

  // 读取品牌配置数据
  static readBrandConfList(): TypeBrandConf[] {
    if (!fse.existsSync(pathUtil.SOURCE_CONFIG_FILE)) {
      throw new Error(ERR_CODE[4003]);
    }
    return BrandOptions.from(pathUtil.SOURCE_CONFIG_FILE).getBrandConfList();
  }

  private getBrandNodes(): XMLNodeElement[] {
    return super.getRootNode().getChildrenNodesByTagname(ELEMENT_TAG.Brand);
  }

  // 获取厂商配置列表
  getBrandConfList(): TypeBrandConf[] {
    return this.getOptions().map(option =>
      new BrandConfig()
        .set("name", option.name)
        .set("md5", option.md5)
        .set("infoTemplate", option.infoTemplate)
        .set("packageConfig", option.packageConfig)
        .set("applyConfig", option.applyConfig)
        .create()
    );
  }

  // 使用 brandName 的 md5 值查找打包配置
  getPackageConfigByBrandMd5(md5: string): TypePackConf | null {
    const brandConf = this.getBrandConfList().find(item => item.md5 === md5);
    return brandConf ? brandConf.packageConfig : null;
  }

  // 使用 brandName 的 md5 值查找应用配置
  getApplyConfigByBrandMd5(md5: string): TypeApplyConf | null {
    const brandConf = this.getBrandConfList().find(item => item.md5 === md5);
    return brandConf ? brandConf.applyConfig : null;
  }

  getOptions(): TypeBrandOption[] {
    return this.getBrandNodes().map(item => {
      const name = item.getAttributeOf("name");
      const src = item.getAttributeOf("src");
      const brandConfig = BrandConfigCompiler.from(src);
      const packageConfig = brandConfig.getPackageConfig();
      const applyConfig = brandConfig.getApplyConfig();
      const infoTemplate = brandConfig.getInfoTemplate();
      return new BrandOption()
        .set("src", src)
        .set("name", name)
        .set("md5", md5(name))
        .set("packageConfig", packageConfig)
        .set("applyConfig", applyConfig)
        .set("infoTemplate", infoTemplate)
        .create();
    });
  }
}
