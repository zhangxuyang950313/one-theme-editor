import md5 from "md5";
import fse from "fs-extra";
import { ELEMENT_TAG } from "src/enum/index";
import { TypeBrandOption } from "src/types/source";
import { BrandOption } from "src/data/BrandConfig";
import XmlTemplate from "server/compiler/XmlTemplate";
import XmlFileCompiler from "server/compiler/XmlFileCompiler";
import pathUtil from "server/utils/pathUtil";
import ERR_CODE from "src/common/errorCode";

export default class BrandOptions extends XmlTemplate {
  // 从文件创建实例
  static from(file: string): BrandOptions {
    const element = new XmlFileCompiler(file).getElement();
    return new BrandOptions(element);
  }

  // 读取厂商配置
  static readBrandOptions(): TypeBrandOption[] {
    if (!fse.existsSync(pathUtil.SOURCE_CONFIG_FILE)) {
      throw new Error(ERR_CODE[4003]);
    }
    return BrandOptions.from(pathUtil.SOURCE_CONFIG_FILE).getOptions();
  }

  getOptions(): TypeBrandOption[] {
    return super
      .getRootNode()
      .getChildrenNodesByTagname(ELEMENT_TAG.Brand)
      .map(item => {
        const name = item.getAttributeOf("name");
        return new BrandOption()
          .set("name", name)
          .set("md5", md5(name))
          .set("src", item.getAttributeOf("src"))
          .create();
      });
  }
}
