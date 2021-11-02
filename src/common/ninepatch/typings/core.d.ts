export declare function getImageEl(imageUrl: string): Promise<HTMLImageElement>;
export declare function loadImage(
  img: HTMLImageElement
): Promise<HTMLImageElement>;
export declare function pixelToDoubleDimensionalArray(
  pixelData: Uint8ClampedArray
): number[][];
export declare function decodeFromCanvasSync(
  canvas: HTMLCanvasElement | OffscreenCanvas
): Promise<iNinePatch.ninePatch.data>;
export declare function scaleNinePatch(
  canvas: HTMLCanvasElement,
  npData: iNinePatch.ninePatch.data,
  targetWidth: number,
  targetHeight: number
): Promise<HTMLCanvasElement | null>;
