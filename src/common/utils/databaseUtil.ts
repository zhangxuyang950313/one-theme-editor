import fse from "fs-extra";
import Nedb from "nedb-promises";

export default class DatabaseUtil {
  static createNedb(filename: string, config?: ConstructorParameters<typeof Nedb>[0]): Nedb {
    fse.ensureFileSync(filename);
    const db = new Nedb({
      filename,
      autoload: false,
      timestampData: true,
      ...(typeof config === "object" ? config : {})
    });
    // 创建数据库有，如果 filename 文件内容不是 nedb 能接受的数据格式则会导致服务崩溃
    db.load().catch(err => {
      // TODO 当数据库错误的处理办法
      console.log("db 文件错误");
    });
    return db;
  }
}
