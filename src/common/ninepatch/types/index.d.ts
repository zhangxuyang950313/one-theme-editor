/* eslint-disable no-unused-vars */
declare namespace iNinePatch {
  type url = string;
  interface options {
    width: number;
    height: number;
  }
  namespace mount {
    type options = {
      width: number;
      height: number;
    };
  }
  namespace ninePatch {
    type padData = {
      padTop: number;
      padBottom: number;
      padRight: number;
      padLeft: number;
    };
    type divs = number[];
    interface data extends padData {
      xDivs: divs;
      yDivs: divs;
    }
  }
  type size = {
    width: number;
    height: number;
  };

  type directPixelsData = {
    align: iNinePatch.directChunkList;
    alignV: iNinePatch.directChunkList;
  };

  type directChunkItem = {
    isDiv: boolean;
    space: [number, number];
    spaceScaled?: [number, number];
    ratio?: number;
    divRatio?: number;
  };
  type directChunkList = directChunkItem[];
}

interface Window {
  ResizeObserver: (x: any) => void;
}
