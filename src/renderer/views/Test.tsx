// 测试页面

import React, { useLayoutEffect } from "react";
import { Button } from "antd";
import { xml2jsonElements } from "server/compiler/xml";
import Page from "server/data/Page";

const file =
  "/Users/zhangxuyang/mine/theme-project/one-theme-editor/static/resource/sourceConfig/xiaomi/miui12/wallpaper/desktop.xml";
const Test: React.FC = () => {
  const test = () => {
    xml2jsonElements(file).then(data => console.log(JSON.stringify(data)));
  };
  useLayoutEffect(() => {
    test();
    const page = new Page(file);
    page.getData().then(console.log);
  }, []);
  return (
    <div>
      <Button onClick={test}>测试</Button>
    </div>
  );
};

export default Test;
