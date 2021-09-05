import { TypeBrandOption } from "src/types/source";
import { AbstractDataModel } from "./AbstractDataModel";
import BrandConfig from "./BrandConfig";

// 厂商配置
export default class BrandOption extends AbstractDataModel<TypeBrandOption> {
  protected data: TypeBrandOption = {
    src: "",
    ...new BrandConfig().create()
  };
}
