import fse from "fs-extra";
import Nedb from "nedb-promises";

export type TypeNedbOptions = ConstructorParameters<typeof Nedb>[0];

class Database extends Nedb {
  constructor(filename: string, config?: TypeNedbOptions) {
    fse.ensureFileSync(filename);
    super({
      filename,
      autoload: false,
      timestampData: true,
      ...(typeof config === "object" ? config : {})
    });
    // 创建数据库有，如果 filename 文件内容不是 nedb 能接受的数据格式则会导致服务崩溃
    super.load().catch(err => {
      // TODO 当数据库错误的处理办法
      console.log("db 文件错误");
    });
  }
}

export default Database;
