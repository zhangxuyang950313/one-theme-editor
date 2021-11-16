import "../types/index.d.ts";

export default class NinePatch {
  private url;
  private originEl;
  private originCanvas;
  originWidth: number;
  originHeight: number;
  ninePatchData: iNinePatch.ninePatch.data;
  private scaledCanvas;
  private _targetWidth;
  private _targetHeight;
  constructor(url: iNinePatch.url);
  get targetWidth(): number;
  get targetHeight(): number;
  set width(val: number);
  set height(val: number);
  hasInitially(): boolean;
  init(): Promise<this>;
  scale(w?: number, h?: number): Promise<HTMLCanvasElement>;
  getBlob(): Promise<Blob>;
  getBase64(): string;
  getScaledCanvas(): HTMLCanvasElement;
}
