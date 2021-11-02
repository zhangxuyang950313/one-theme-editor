/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */
/* eslint-disable no-undef */

// // 计算 pad 缩放
// function computePadScaled(
//   ninePatchData: iNinePatch.ninePatch.data,
//   originSize: iNinePatch.size,
//   targetSize: iNinePatch.size
// ): iNinePatch.ninePatch.padData {
//   const { padLeft, padRight, padTop, padBottom } = ninePatchData;
//   // 存在缩放目标，则需要着重看一下缩小的情况
//   // 内容区域缩至为1px以下后将会缩 padLeft、padRight、padTop 或 padBottom
//   const alignRatio = targetSize.width / originSize.width;
//   const alignVRatio = targetSize.height / originSize.height;
//   const alignChunkLength = originSize.width - padLeft - padRight;
//   const alignVChunkLength = originSize.height - padTop - padBottom;
//   const result = { padLeft, padRight, padTop, padBottom };
//   if (alignRatio < 1 && targetSize.width < alignChunkLength) {
//     const ratio = targetSize.width / alignChunkLength;
//     result.padLeft = Math.round(padLeft * ratio);
//     result.padRight = Math.round(padRight * ratio);
//   }
//   if (alignVRatio < 1 && targetSize.height < alignVChunkLength) {
//     const ratio = targetSize.width / alignVChunkLength;
//     result.padTop = Math.round(padTop * ratio);
//     result.padBottom = Math.round(padBottom * ratio);
//   }
//   return result;
// }

// // 检查给定像素是否是没有间断的纯黑色
// function checkAllBlack(pixels: number[][]) {
//   let start = false;
//   let end = false;
//   return pixels.every(([r, g, b, a]) => {
//     const isBlack = r + g + b === 0 && a === 255;
//     if (start && end && isBlack) return false;
//     if (isBlack) return (start = true);
//     else return (end = true);
//   });
// }

// // 获取 HTMLImageElement 对象
// export function getElement(el: iNinePatch.url) {
//   let imgEl: HTMLImageElement | null = null;
//   if (typeof el === 'string') {
//     imgEl = document.querySelector(el);
//   } else if (el instanceof HTMLImageElement) {
//     imgEl = el;
//   }
//   return imgEl;
// }

export async function getImageEl(imageUrl: string) {
  const image = new Image();
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
    image.src = imageUrl;
  });
  return image;
}

export async function loadImage(img: HTMLImageElement) {
  const image = new Image();
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
    image.src = img.src;
  });
  image.onload = null;
  image.onerror = null;
  return image;
}

// 像素信息二维数组化，每一个元素储存 1px 信息
export function pixelToDoubleDimensionalArray(pixelData: Uint8ClampedArray) {
  const arr: number[][] = [];
  const pixelArr = Array.from(pixelData);
  const count = pixelArr.length / 4;
  for (let i = 0; i < count; i++) {
    arr.push(pixelArr.splice(0, 4));
  }
  return arr;
}
// 从 Uint8ClampedArray 中获取去除黑边的像素信息
function getCenterPixFromUnit8Arr(unit8Arr: Uint8ClampedArray) {
  const arr = pixelToDoubleDimensionalArray(unit8Arr);
  return arr.slice(1, arr.length - 1);
}

// // 夹逼计算
// function squeezeComputer(centerPix: number[][]) {
//   let front = 0,
//     behind = 0;
//   for (let i = 0; i < centerPix.length; i++) {
//     const isTransparent = centerPix[i][3] === 0;
//     if (!isTransparent) {
//       front = i;
//       break;
//     }
//   }
//   for (let i = centerPix.length - 1; i > 0; i--) {
//     const isTransparent = centerPix[i][3] === 0;
//     if (!isTransparent) {
//       behind = centerPix.length - i - 1;
//       break;
//     }
//   }
//   // 检查中间是否有断掉的黑色
//   if (checkAllBlack(centerPix.slice(front, behind))) return null;
//   else return { front, behind };
// }

// 顺序计算
function sequenceComputer(centerPix: number[][]) {
  let front = 0;
  let behind = 0;
  let start = false;
  let end = false;
  let useless = false;
  for (let i = 0; i < centerPix.length; i++) {
    const [r, g, b, a] = centerPix[i];
    const isBlack = r + g + b === 0 && a === 255;
    const isTransparent = a === 0;
    if (!isTransparent && !isBlack) {
      useless = true;
      break;
    }
    if (isBlack && !start) {
      front = i;
      start = true;
      continue;
    }
    if (isTransparent && start && !end) {
      behind = centerPix.length - i;
      end = true;
      break;
    }
  }
  if (useless) {
    front = 0;
    behind = centerPix.length - 1;
    // eslint-disable-next-line no-console
    console.warn(centerPix, "含有非合法颜色值");
  }
  return { front, behind };
}

// 计算边距
// 废除夹逼计算，采用顺序计算，只取第一个 div 片段数据作为 pad 数据
function computePad(unit8Arr: Uint8ClampedArray) {
  const centerPix = getCenterPixFromUnit8Arr(unit8Arr);
  // const squeeze = squeezeComputer(centerPix);
  const sequence = sequenceComputer(centerPix);
  return sequence;
}

// 计算 div 区域
function computeDivs(unit8Arr: Uint8ClampedArray) {
  const centerPix = getCenterPixFromUnit8Arr(unit8Arr);
  const arr: iNinePatch.ninePatch.divs = [];
  if (centerPix.length > 0) {
    let status = true;
    const lastIndex = centerPix.length - 1;
    const lastIsBlack = centerPix[lastIndex][3] === 255;
    for (let i = 0; i < centerPix.length; i++) {
      const isTransparent = centerPix[i][3] === 0;
      if (status !== isTransparent) {
        status = isTransparent;
        arr.push(i);
      }
      if (i === lastIndex && lastIsBlack) {
        arr.push(i + 1);
      }
    }
  }
  return arr;
}

type allDirectUnit8Array = {
  top: Uint8ClampedArray;
  right: Uint8ClampedArray;
  bottom: Uint8ClampedArray;
  left: Uint8ClampedArray;
};

// 从各方向像素数据计算 ninePatchData
// 同步方法
// function computeNinePatch(
//   pixels: allDirectUnit8Array
// ): iNinePatch.ninePatch.data {
//   const { top, right, bottom, left } = pixels;
//   const xDivs = computeDivs(top);
//   const yDivs = computeDivs(left);
//   const { front: padLeft, behind: padRight } = computePad(bottom);
//   const { front: padTop, behind: padBottom } = computePad(right);
//   return { padLeft, padRight, padTop, padBottom, xDivs, yDivs };
// }
// 异步方法
async function computeNinePatchSync(
  pixels: allDirectUnit8Array
): Promise<iNinePatch.ninePatch.data> {
  const { top, right, bottom, left } = pixels;
  const [
    xDivs,
    yDivs,
    { front: padLeft, behind: padRight },
    { front: padTop, behind: padBottom }
  ] = await Promise.all([
    asyncToSync(() => computeDivs(top)),
    asyncToSync(() => computeDivs(left)),
    asyncToSync(() => computePad(bottom)),
    asyncToSync(() => computePad(right))
  ]);
  return { padLeft, padRight, padTop, padBottom, xDivs, yDivs };
}

function createCanvas(width: number, height: number) {
  let canvas: HTMLCanvasElement | OffscreenCanvas = null;
  if (window.OffscreenCanvas) {
    canvas = new OffscreenCanvas(width, height);
  } else {
    canvas = document.createElement("canvas");
    canvas.setAttribute("width", `${width}px`);
    canvas.setAttribute("height", `${height}px`);
  }
  return canvas;
}

// 提取 canvas 指定区域
function getCanvasArea(
  cvs: HTMLCanvasElement | OffscreenCanvas,
  left: number,
  top: number,
  width: number,
  height: number
) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(cvs, left, top, width, height, 0, 0, width, height);
  return canvas;
}

// 获取内容区域
function getContentCanvas(cvs: HTMLCanvasElement | OffscreenCanvas) {
  return getCanvasArea(cvs, 1, 1, cvs.width - 2, cvs.height - 2);
}

// 从 canvas 解析 ninePatchData
// // 同步方法
// function decodeFromCanvas(canvas: HTMLCanvasElement | OffscreenCanvas) {
//   const { width, height } = canvas;
//   const ctx = canvas.getContext('2d');
//   const top = ctx.getImageData(0, 0, width, 1).data;
//   const bottom = ctx.getImageData(0, height - 1, width, 1).data;
//   const left = ctx.getImageData(0, 0, 1, height).data;
//   const right = ctx.getImageData(width - 1, 0, 1, height).data;
//   return computeNinePatch({ top, bottom, left, right });
// }
// 异步方法
export async function decodeFromCanvasSync(
  canvas: HTMLCanvasElement | OffscreenCanvas
) {
  const { width, height } = canvas;
  const ctx = canvas.getContext("2d");
  const top = ctx.getImageData(0, 0, width, 1).data;
  const bottom = ctx.getImageData(0, height - 1, width, 1).data;
  const left = ctx.getImageData(0, 0, 1, height).data;
  const right = ctx.getImageData(width - 1, 0, 1, height).data;
  return await computeNinePatchSync({ top, bottom, left, right });
}

function doubleMapper<T>(
  list: T[],
  callback: (left: T, right: T, isLast: boolean) => void
) {
  for (let i = 0; i < list.length; i += 2) {
    callback(list[i], list[i + 1], i === list.length - 2);
  }
}

// 生成完整的 chunk 数据
function getIntactChunkData(
  divs: iNinePatch.ninePatch.divs,
  originLength: number
) {
  let offset = 0;
  const directDivData: iNinePatch.directChunkList = [];
  doubleMapper(divs, (left, right, isLast) => {
    directDivData.push(
      { isDiv: false, space: [offset, left] },
      { isDiv: true, space: [left, right] }
    );
    offset = right;
    if (!isLast) return;
    directDivData.push({ isDiv: false, space: [right, originLength] });
  });
  return directDivData;
}

/**
 * 整型比例
 * 避免 canvas 绘制浮点影响性能
 * 避免 绘制浮点会出现透明度
 *  */
function integrateRatio(ratio: number) {
  return Math.round(ratio);
}

// 计算缩放后的 div 长度
function computeDirectScaled(
  divs: iNinePatch.ninePatch.divs,
  originLength: number,
  targetLength: number
) {
  let totalNormal = 0; // 非 div 区域总长度
  let totalDiv = 0; // div 区域总长度
  doubleMapper(divs, (start, end) => (totalDiv += end - start));
  totalNormal = originLength - totalDiv;
  // 总缩放比例
  const ratio = targetLength / originLength || 1;
  // div 缩放比例，最小缩放到 0
  const divRatio = Math.max((targetLength - totalNormal) / totalDiv, 0);

  const isEnough = ratio >= 1; // 总缩放比例是否足够
  const divIsEnough = divRatio >= 1; // div 缩放比例是否足够
  const intactChunkData = getIntactChunkData(divs, originLength);

  let offset = 0;
  intactChunkData.forEach(item => {
    const { isDiv, space } = item;
    let scaleRatio = divRatio;
    // 缩放比例大于 1，非 div 区域不动，div 区域按比例进行缩放
    if (isEnough && !isDiv) scaleRatio = 1;
    // 缩放比例小于 1，div 区域是否够缩，不够则缩放非 div 区域
    else if (!divIsEnough && !isDiv) scaleRatio = ratio;
    const [start, end] = space;
    const scaledSpace = (end - start) * scaleRatio;
    const endOffset = offset + integrateRatio(scaledSpace);
    item.ratio = ratio;
    item.divRatio = divRatio;
    item.spaceScaled = [offset, endOffset];
    offset = endOffset;
  });
  // console.log('缩放后的 chunk 数据', intactChunkData);
  return intactChunkData;
}

// 同步任务转异步任务
async function asyncToSync<T>(asyncFuncs: () => T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(asyncFuncs()), 0));
}
// 同步队列转异步队列
// TODO：目前仅用于返回值相同的函数，因为类型不会写。。。用 Promise.all 配合 asyncToSync 效果相同
// async function asyncToSyncQueue<T>(...asyncFuncs: (() => T)[]) {
//   return await Promise.all(asyncFuncs.map(asyncToSync));
// }

// 缩放 canvas
function scaleCanvas(
  cvs: HTMLCanvasElement | OffscreenCanvas,
  width: number,
  height: number
) {
  if (cvs.width === 0 || cvs.height === 0) return cvs;
  const canvas = createCanvas(width, height);
  canvas.getContext("2d").drawImage(cvs, 0, 0, width, height);
  return canvas;
}

/**
 * 缩放轴线
 * @param pixelsData 像素区域数据，就是控制.9黑色像素区域
 * @param direct 缩放轴，align / alignV，和 pixelsData 的属性同名
 * @param cvs 要缩放的图片数据
 * @param targetWidth 目标宽度
 * @param targetHeight 目标高度
 */
async function handleScaleDirect(
  pixelsData: iNinePatch.directPixelsData,
  direct: keyof iNinePatch.directPixelsData,
  cvs: HTMLCanvasElement | OffscreenCanvas,
  targetWidth: number,
  targetHeight: number
) {
  // 创建缩放画布
  const scaleDirectCanvas = document.createElement("canvas");
  scaleDirectCanvas.setAttribute("width", `${targetWidth}px`);
  scaleDirectCanvas.setAttribute("height", `${targetHeight}px`);
  const scaleDirectCtx = scaleDirectCanvas.getContext("2d");
  const chunksScaleQueue = [];
  pixelsData[direct].forEach(({ space, spaceScaled }) => {
    const [start, end] = space;
    const count = end - start;
    const [startOffset, endOffset] = spaceScaled;
    const countScaled = endOffset - startOffset;
    if (direct === "align") {
      const chunkCanvas = getCanvasArea(cvs, start, 0, count, cvs.height);
      const scaleChunk = asyncToSync(() =>
        scaleCanvas(chunkCanvas, countScaled, cvs.height)
      );
      chunksScaleQueue.push(scaleChunk);
      scaleChunk.then(scaledCanvas => {
        if (scaledCanvas.width === 0 || scaledCanvas.height === 0) return;
        scaleDirectCtx.drawImage(scaledCanvas, startOffset, 0);
      });
    }
    if (direct === "alignV") {
      const chunkCanvas = getCanvasArea(cvs, 0, start, cvs.width, count);
      const scaleChunk = asyncToSync(() =>
        scaleCanvas(chunkCanvas, cvs.width, countScaled)
      );
      chunksScaleQueue.push(scaleChunk);
      scaleChunk.then(scaledCanvas => {
        if (scaledCanvas.width === 0 || scaledCanvas.height === 0) return;
        scaleDirectCtx.drawImage(scaledCanvas, 0, startOffset);
      });
    }
  });
  await Promise.all(chunksScaleQueue);
  return scaleDirectCanvas;
}

// 缩放 .9 图
export async function scaleNinePatch(
  canvas: HTMLCanvasElement,
  npData: iNinePatch.ninePatch.data,
  targetWidth: number,
  targetHeight: number
): Promise<HTMLCanvasElement | null> {
  if (targetWidth * targetHeight === 0) {
    return asyncToSync(() => null);
  }
  // 同步方法
  // const ninePatchData = decodeFromCanvas(canvas); // 从 canvas 解析 .9 信息
  // const contentCanvas = getContentCanvas(canvas); // 生成去除 .9 信息的图内容区域画布

  // 异步优化 将两个同步计算转为并行
  const [ninePatchData, contentCanvas] = await Promise.all([
    npData ? asyncToSync(() => npData) : decodeFromCanvasSync(canvas), // 从 canvas解析 或者缓存获得 .9 信息
    asyncToSync(() => getContentCanvas(canvas)) // 生成去除 .9 信息的图内容区域画布
  ]);

  const { width: originWidth, height: originHeight } = contentCanvas;
  const { xDivs, yDivs } = ninePatchData;
  // 生成横竖两个方向的最终缩放数据
  // 同步方法
  // const pixelsDataScaled: iNinePatch.directPixelsData = {
  //   align: computeDirectScaled(xDivs, originWidth, targetWidth),
  //   alignV: computeDirectScaled(yDivs, originHeight, targetHeight)
  // };
  // 异步优化
  const pixelsDataScaled: iNinePatch.directPixelsData = await new Promise(
    resolve => {
      Promise.all([
        asyncToSync(() => computeDirectScaled(xDivs, originWidth, targetWidth)),
        asyncToSync(() =>
          computeDirectScaled(yDivs, originHeight, targetHeight)
        )
      ]).then(([align, alignV]) => resolve({ align, alignV }));
    }
  );
  // 使用缩放数据进行重绘
  const stackCanvas = await handleScaleDirect(
    pixelsDataScaled,
    "align",
    contentCanvas,
    targetWidth,
    originHeight
  );
  const finalCanvas = await handleScaleDirect(
    pixelsDataScaled,
    "alignV",
    stackCanvas,
    targetWidth,
    targetHeight
  );
  return finalCanvas;
}
