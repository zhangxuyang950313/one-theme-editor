import rendererIpc from "src/ipc/ipc-renderer";

Object.assign(global, {
  $server: rendererIpc
});
