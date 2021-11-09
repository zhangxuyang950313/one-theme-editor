export default class LogUtil {
  static addPrefix(prefix: string): void {
    const log = console.log;
    console.log = (...args) => log(prefix, ...args);
  }

  static init(title: string, content: unknown): void {
    if (!content) return;
    console.log(
      `%c${title}%c${content}%c`,
      "background: #41b883; padding: 1px 5px; border-radius: 3px 0 0 3px;  color: #fff",
      "background: #35495e; padding: 1px 5px; border-radius: 0 3px 3px 0;  color: #fff",
      "background: transparent"
    );
  }

  static database(title: string, content: unknown): void {
    if (!content) return;
    console.log(
      `%c[database]${title}%c${content}%c`,
      "background: #00b4ff; padding: 1px 5px; border-radius: 3px 0 0 3px;  color: #fff",
      "background: #35495e; padding: 1px 5px; border-radius: 0 3px 3px 0;  color: #fff",
      "background: transparent"
    );
  }

  static ipc(title: string, content: unknown): void {
    if (!content) return;
    console.log(
      `%c[ipc]${title}%c${content}%c`,
      "background: #ff4187; padding: 1px 5px; border-radius: 3px 0 0 3px;  color: #fff",
      "background: #35495e; padding: 1px 5px; border-radius: 0 3px 3px 0;  color: #fff",
      "background: transparent"
    );
  }

  static cache(content: unknown): void {
    if (!content) return;
    console.log(
      `%c[cache]%c${content}%c`,
      "background: #ff9a00; padding: 1px 5px; border-radius: 3px 0 0 3px;  color: #fff",
      "background: #35495e; padding: 1px 5px; border-radius: 0 3px 3px 0;  color: #fff",
      "background: transparent"
    );
  }
}
