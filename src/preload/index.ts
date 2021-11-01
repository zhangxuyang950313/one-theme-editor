import * as electronStore from "src/store";
import { registerRendererIpcToGlobal } from "src/ipc/ipc-renderer";
import { registerReactiveStateToGlobal } from "./ReactiveState";

function registerElectronStoreInstanceToGlobal(): void {
  Object.assign(global, {
    $electronStore: electronStore
  });
}

registerElectronStoreInstanceToGlobal();

registerRendererIpcToGlobal();

registerReactiveStateToGlobal();
