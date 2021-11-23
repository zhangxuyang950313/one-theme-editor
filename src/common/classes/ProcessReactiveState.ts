import { ipcMain, IpcMainEvent, ipcRenderer } from "electron";
import IPC_EVENT from "src/ipc/ipc-event";

// 构建进程间响应数据
class ReactiveState<T extends Record<string, unknown>, K extends keyof T> {
  private state: T;
  private $replyEvent: IpcMainEvent | null = null;
  private hooks = new Set<(obj: T, prop: K, value: T[K]) => void>();
  constructor(state: T) {
    this.state = { ...state };
    if (this.isMain) {
      ipcMain.on(IPC_EVENT.$reactiveSet, ($event, $data) => {
        this.$replyEvent = $event;
      });
    }
    (ipcMain || ipcRenderer).on(
      IPC_EVENT.$reactiveSet,
      ($event, $data: { prop: K; value: T[K] }) => {
        this.hooks.forEach(hook => {
          hook(this.state, $data.prop, $data.value);
        });
        this.state[$data.prop] = $data.value;
      }
    );
  }

  private get isRenderer() {
    return !!ipcRenderer;
  }

  private get isMain() {
    return !!ipcMain;
  }

  set<K extends keyof T>(prop: K, value: T[K]): void {
    const payload = { prop, value };
    if (this.isRenderer) {
      ipcRenderer.send(IPC_EVENT.$reactiveSet, payload);
    }
    if (this.isMain && this.$replyEvent) {
      this.$replyEvent.sender.send(IPC_EVENT.$reactiveSet, payload);
    }
    if (prop in this.state) {
      this.state[prop] = value;
    }
  }

  get<K extends keyof T>(prop: K): T[K] {
    return this.state[prop];
  }

  get store(): T {
    return this.state;
  }

  addSetterHook(
    hook: <K extends keyof T>(obj: T, prop: K, value: T[K]) => void
  ): void {
    this.hooks.add(hook);
  }

  removeSetterHook(
    hook: <K extends keyof T>(obj: T, prop: K, value: T[K]) => void
  ): void {
    this.hooks.delete(hook);
  }
}

export default ReactiveState;
