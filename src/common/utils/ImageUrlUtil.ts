import electronStore from "../electronStore";

export default class ImageUrlUtil {
  // TODO: 增加图片缓存时间
  static getUrl(
    pathname: string,
    // 模糊值，数字越大越模糊，减少短时间内相同图片生成不同的 url 影响缓存
    blur: 0 | 1 | 2 | 3 | 4 = 1
  ): string {
    const hostname = electronStore.get("hostname");
    const now = String(Date.now());
    const timeSys = now.substr(0, now.length - blur);
    return `http://${hostname}/image?filepath=${pathname}&t=${timeSys}`;
    // return `local-resource://${pathname}?t=${timeSys}`; // 自定义协议方法备用
  }
}
