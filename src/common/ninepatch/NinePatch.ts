import {
  loadImage,
  getImageEl,
  scaleNinePatch,
  decodeFromCanvasSync
} from "./core";

export default class NinePatch {
  private url: iNinePatch.url;
  private originEl: HTMLImageElement | null;
  private originCanvas: HTMLCanvasElement | null;
  originWidth: number;
  originHeight: number;
  ninePatchData: iNinePatch.ninePatch.data | null;
  private scaledCanvas: HTMLCanvasElement | null;
  private _targetWidth: number;
  private _targetHeight: number;
  constructor(url: iNinePatch.url) {
    this.url = url;
    this.originEl = null;
    this.originWidth = 0;
    this.originHeight = 0;
    this._targetWidth = 0;
    this._targetHeight = 0;
    this.originCanvas = null;
    this.scaledCanvas = null;
    this.ninePatchData = null;
  }

  get targetWidth() {
    return this._targetWidth || this.originEl.width;
  }

  get targetHeight() {
    return this._targetHeight || this.originEl.height;
  }

  set width(val: number) {
    this._targetWidth = val;
  }

  set height(val: number) {
    this._targetHeight = val;
  }

  hasInitially() {
    return !!this.originCanvas;
  }

  async init() {
    this.originEl = await getImageEl(this.url);
    if (!this.originEl) throw new Error(`未找到元素${this.url}`);
    const image = await loadImage(this.originEl);
    this.originWidth = image.width;
    this.originHeight = image.height;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("width", `${this.originWidth}px`);
    canvas.setAttribute("height", `${this.originHeight}px`);
    canvas.getContext("2d").drawImage(image, 0, 0);
    this.originCanvas = canvas;
    this.ninePatchData = await decodeFromCanvasSync(this.originCanvas);
    return this;
  }

  async scale(w?: number, h?: number) {
    if (this.hasInitially) await this.init(); // 初始化耗时操作，缓存下来.9信息和canvas
    if (w >= 0) this.width = w;
    if (h >= 0) this.height = h;
    this.scaledCanvas = await scaleNinePatch(
      this.originCanvas,
      this.ninePatchData,
      this.targetWidth,
      this.targetHeight
    );
    return this.scaledCanvas;
  }

  async getBlob() {
    return await new Promise((resolve: BlobCallback) => {
      this.scaledCanvas.toBlob(resolve);
    });
  }

  getBase64() {
    return this.scaledCanvas.toDataURL();
  }

  getScaledCanvas() {
    return this.scaledCanvas;
  }
}
