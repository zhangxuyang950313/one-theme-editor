import * as electronStore from "src/store";
import rendererIpc from "src/ipc/ipc-renderer";
import { registerReactiveStateRenderer } from "./ReactiveState";

Object.assign(global, {
  $server: rendererIpc,
  $electronStore: electronStore
});

registerReactiveStateRenderer();
