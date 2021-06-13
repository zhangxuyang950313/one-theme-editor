import fse from "fs-extra";
import uuid from "uuid";

type TypeDocument = {
  _id: string;
  createAt: Date;
  updateAt: Date;
};

export type TypeOptions = {
  filename: string;
};

export default class MyDatabase {
  private filename: string;
  private data: any[];

  constructor(options: TypeOptions) {
    this.filename = options.filename;
    fse.ensureFileSync(this.filename);
    this.data = fse.readJSONSync(this.filename) || [];
  }

  private async readData() {
    this.data = await fse.readJSON(this.filename).catch(err => {
      console.log("read fail", err);
    });
    return this.data;
  }

  private async save() {
    return fse.outputJSON(this.filename, this.data).catch(err => {
      console.log("save fail", err);
    });
  }

  async insert<T>(di: T): Promise<T & TypeDocument> {
    const time = new Date().getTime();
    const data = {
      _id: uuid.v4(),
      ...di,
      createAt: time,
      updateAt: time
    };
    this.data.push(data);
    await this.save();
    return {
      ...data,
      createAt: new Date(data.createAt),
      updateAt: new Date(data.updateAt)
    };
  }

  findById<T = any>(id: string): (T & TypeDocument) | null {
    return this.data.find(item => item._id === id) || null;
  }

  findAll<T = any>(): Array<T & TypeDocument> {
    return this.data;
  }

  async updateById<T = any>(
    id: string,
    di: T
  ): Promise<(T & TypeDocument) | null> {
    const data = this.findById<T>(id);
    Object.assign(data, { ...di, updateAt: new Date().getTime() });
    await this.save();
    return data;
  }
}
