export default class LogUtil {
  static addPrefix(prefix: string): void {
    const log = console.log;
    console.log = (...args) => log(prefix, ...args);
  }
}
