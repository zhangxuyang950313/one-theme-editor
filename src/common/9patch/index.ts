/* eslint-disable no-undef */
import "../types/index.d.ts";

import { VueConstructor } from "vue";

import NinePatch from "./NinePatch";

type iBorderBoxSize = { offsetWidth: number; offsetHeight: number };
class RenderNinePatch {
  ninePatch: NinePatch;
  ninePatchData: iNinePatch.ninePatch.data;
  constructor() {
    this.ninePatch = null;
    this.ninePatchData = null;
  }

  private async div(el: HTMLDivElement, borderBoxSize?: iBorderBoxSize) {
    if (!this.ninePatch) {
      el.style.display = "none";
      const backgroundImageUrl = window
        .getComputedStyle(el)
        .getPropertyValue("background-image")
        .slice(5, -2);
      // console.time('init耗时');
      this.ninePatch = await new NinePatch(backgroundImageUrl).init();
      this.ninePatchData = this.ninePatch.ninePatchData;
      // console.timeEnd('init耗时');
    }
    const { padTop, padRight, padBottom, padLeft } = this.ninePatchData;
    const { offsetWidth, offsetHeight } = borderBoxSize ? borderBoxSize : el;
    // console.time('绘制耗时');
    const scaledCvs = await this.ninePatch.scale(offsetWidth, offsetHeight);
    const backgroundImage = scaledCvs.toDataURL();
    // console.timeEnd('绘制耗时');
    el.style.cssText = `display: inline-block;
                        box-sizing: border-box;
                        padding: ${padTop}px ${padRight}px ${padBottom}px ${padLeft}px;
                        background-repeat: no-repeat;
                        background-size: ${offsetWidth}px ${offsetHeight}px;
                        background-image: url(${backgroundImage});`;
  }

  private async img(el: HTMLImageElement, borderBoxSize?: iBorderBoxSize) {
    if (!this.ninePatch) {
      el.style.display = "none";
      this.ninePatch = await new NinePatch(el.src).init();
      this.ninePatchData = this.ninePatch.ninePatchData;
    }
    const { offsetWidth, offsetHeight } = borderBoxSize ? borderBoxSize : el;
    const scaledCvs = await this.ninePatch.scale(offsetWidth, offsetHeight);
    new Promise((resolve, reject) => {
      el.onload = resolve;
      el.onerror = reject;
    }).finally(() => {
      el.style.display = "";
    });
    el.src = scaledCvs.toDataURL();
  }

  // 传入 borderBoxSize 变更数据减少浏览器回流
  async render(el: HTMLElement, borderBoxSize?: iBorderBoxSize) {
    // console.time('总耗时');
    if (el instanceof HTMLDivElement) {
      this.div(el, borderBoxSize);
      return;
    }
    if (el instanceof HTMLImageElement) {
      this.img(el, borderBoxSize);
      return;
    }
    // console.timeEnd('总耗时');
  }
}

// 获取 CSS 属性值计算前的值，比如 width: 50%，getComputedStyle 为计算后的 px
// 原理就是将父元素隐藏阻止计算
// function getCSSValueBeforeCompute(el: Element, prop: string) {
//   const parentHidden = el.parentElement.hidden;
//   el.parentElement.hidden = true;
//   // TODO 可以做一个 getComputedStyle 缓存减少回流
//   const value = window.getComputedStyle(el)[prop];
//   el.parentElement.hidden = parentHidden;
//   return value;
// }

export default {
  install(Vue: VueConstructor) {
    Vue.directive("nine-patch", {
      inserted: el => {
        const renderNinePatch = new RenderNinePatch();
        window.ResizeObserver
          ? new window.ResizeObserver((data: any) => {
              let borderBoxSize = null;
              try {
                borderBoxSize = {
                  offsetWidth: data[0].borderBoxSize[0].inlineSize,
                  offsetHeight: data[0].borderBoxSize[0].blockSize
                };
              } catch (e) {
                // console.log(e);
              }
              renderNinePatch.render(el, borderBoxSize);
            }).observe(el)
          : renderNinePatch.render(el);
      }
    });
  }
};
export function createNinePatch(el: iNinePatch.url) {
  return new NinePatch(el);
}
