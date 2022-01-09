import NinePatchWorker from "src/common/classes/NinePatchWorker";

const workers = {
  ninePatch: new NinePatchWorker()
};

export default workers;

// 注册到主进程
Object.defineProperty(global, "$workers", {
  value: workers,
  writable: false,
  configurable: false
});
