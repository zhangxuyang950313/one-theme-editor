import EventEmitter from "events";

export enum PREVIEW_EVENT {
  "locateLayout" = "locate:layout",
  "locateResource" = "locate:resource"
}

export const previewResourceEmitter = new EventEmitter();
