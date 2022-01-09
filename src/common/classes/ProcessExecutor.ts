import { ChildProcess } from "child_process";
/* eslint-disable @typescript-eslint/ban-types */
enum MessageType {
  GET,
  SET,
  APPLY
}

type TypeMessageWithId<T> = { id: number; data: T };
type TypeGetMessage = TypeMessageWithId<{
  type: MessageType.GET;
  path: string[];
}>;
type TypeSetMessage = TypeMessageWithId<{
  type: MessageType.SET;
  path: string[];
}>;
type TypeApplyMessage = TypeMessageWithId<{
  type: MessageType.APPLY;
  path: string[];
  args: any[];
}>;
type TypeMessage = TypeGetMessage | TypeSetMessage | TypeApplyMessage;

export default class Executor {
  // 消息递增唯一 id，匹配消息数据
  static id = 0;

  // 消息处理答复封装为 promise 形式
  private static messageHandler<T>(child: ChildProcess, message: T): Promise<T> {
    return new Promise(resolve => {
      Executor.id++;
      child.on("message", function listener(data: TypeMessageWithId<T>) {
        if (!data || !data.id || data.id !== Executor.id) {
          return;
        }
        // 本次消息答复完毕从消息队列中清除
        child.removeListener("message", listener);
        resolve(data.data);
      });
      child.send({ id: Executor.id, data: message } as TypeMessageWithId<T>);
    });
  }

  private static createProxy<T extends object>(
    child: ChildProcess,
    path: Array<string | number | symbol> = [],
    target: object = {}
  ): T {
    const proxy = new Proxy(target, {
      get(target, prop) {
        console.log({ target, prop });
        // 由于 await 的原因，最后会对 'then' 属性进行访问
        if (prop === "then") {
          if (path.length === 0) {
            return { then: () => proxy };
          }
          // 请看文章后续部分
          const r = Executor.messageHandler(child, {
            type: MessageType.GET,
            path: path.map(p => p.toString())
          });
          // .then(fromWireValue);
          return r.then.bind(r);
        }
        return Executor.createProxy(child, [...path, prop]);
      },
      apply(target, thisArg, args) {
        Executor.messageHandler(child, {
          type: MessageType.APPLY,
          path,
          args
        });
      }
    });
    return proxy as T;
  }

  // 主线程包装器
  static wrap<T extends object>(child: ChildProcess): T {
    return Executor.createProxy(child, []);
  }

  // 子线程导出
  static expose<T extends Record<string, any>>(obj: T): void {
    process.on("message", function callback(msg: TypeMessage) {
      if (!msg || !msg.data) {
        return;
      }
      const parent = msg.data.path.slice(0, -1).reduce((obj, prop) => obj[prop], obj);
      const rawValue = msg.data.path.reduce((obj, prop) => obj[prop], obj);
      let returnValue: T | null = null;
      switch (msg.data.type) {
        case MessageType.GET: {
          returnValue = rawValue;
          break;
        }
        case MessageType.SET: {
          //
          break;
        }
        case MessageType.APPLY: {
          const argumentList = msg.data.args || [];
          returnValue = rawValue.apply(parent, argumentList);
          break;
        }
      }
      process.send?.({ id: msg.id, data: returnValue });
    });
  }
}
