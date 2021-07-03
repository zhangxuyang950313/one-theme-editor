// 测试页面

import React, { useLayoutEffect } from "react";
import { Button } from "antd";
import { xml2jsonElement } from "server/core/xml";
import Page from "server/compiler/Page";
import XmlTemplate from "server/compiler/XmlTemplate";
import TempKeyValMapper from "server/compiler/TempKeyValMapper";

const pageFile =
  "/Users/zhangxuyang/mine/one-theme-editor/static/resource/sourceConfig/xiaomi/miui12/wallpaper/desktop.xml";

const xmlTempFile =
  "/Users/zhangxuyang/mine/one-theme-editor/static/resource/sourceConfig/xiaomi/miui12/wallpaper/theme_values.xml";

const xmlTempValFile =
  "/Users/zhangxuyang/mine/one-theme-editor/static/resource/sourceConfig/xiaomi/miui12/wallpaper/value_mapper.xml";

const Test: React.FC = () => {
  useLayoutEffect(() => {
    // xml2jsonElement(pageFile).then(data => console.log(JSON.stringify(data)));
    const page = new Page(pageFile);
    page.getData().then(console.log);

    const xmlTemplate = new XmlTemplate(xmlTempFile);
    xmlTemplate.getData().then(console.log);

    // const xmlTemplateValue = new TempKeyValMapper(xmlTempValFile);
    // xmlTemplateValue.getTemplateValueData();
    // xmlTemplateValue.getDataList().then(console.log);
    // xmlTemplateValue.getDataMap().then(console.log);
  }, []);
  return (
    <div>
      <Button>测试</Button>
    </div>
  );
};

export default Test;
