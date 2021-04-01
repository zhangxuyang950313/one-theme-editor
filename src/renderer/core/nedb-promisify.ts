import { promisify } from "util";
import Nedb from "nedb";

// nedb promisify
export default class NedbPromisify<T> {
  private instance: Promise<Nedb<T>>;

  constructor(options?: Nedb.DataStoreOptions) {
    this.instance = new Promise((resolve, reject) => {
      const db = new Nedb({
        ...options,
        onload: err => {
          if (options?.onload) {
            options.onload(err);
          }
          if (err) reject(err);
          else resolve(db);
        }
      });
    });
  }

  async insert(data: T): Promise<T> {
    const db = await this.instance;
    return await promisify<T, T>(db.insert.bind(db))(data);
  }

  async getAllData(): Promise<T[]> {
    const db = await this.instance;
    return db.getAllData();
  }
}
