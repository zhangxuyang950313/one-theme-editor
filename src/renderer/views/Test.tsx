// 测试页面

import React, { useLayoutEffect } from "react";
import { Button } from "antd";
import { xml2jsonElements } from "server/compiler/xml";
import Page from "server/data/Page";
import XmlTemplate from "server/data/XmlTemplate";
import TempKeyValMapper from "server/data/TempKeyValMapper";

const pageFile =
  "/Users/zhangxuyang/mine/one-theme-editor/static/resource/sourceConfig/xiaomi/miui12/wallpaper/desktop.xml";

const xmlTempFile =
  "/Users/zhangxuyang/mine/one-theme-editor/static/resource/sourceConfig/xiaomi/miui12/wallpaper/theme_values.xml";

const xmlTempValFile =
  "/Users/zhangxuyang/mine/one-theme-editor/static/resource/sourceConfig/xiaomi/miui12/wallpaper/value_mapper.xml";

const Test: React.FC = () => {
  useLayoutEffect(() => {
    xml2jsonElements(pageFile).then(data => console.log(JSON.stringify(data)));
    const page = new Page(pageFile);
    page.getData().then(console.log);

    const xmlTemplate = new XmlTemplate(xmlTempFile);
    xmlTemplate.getTemplateData();

    const xmlTemplateValue = new TempKeyValMapper(xmlTempValFile);
    xmlTemplateValue.getTemplateValueData();
    xmlTemplateValue.getDataList().then(console.log);
    xmlTemplateValue.getDataMap().then(console.log);
  }, []);
  return (
    <div>
      <Button>测试</Button>
    </div>
  );
};

export default Test;
