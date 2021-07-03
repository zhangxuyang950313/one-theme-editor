// 测试页面

import React, { useLayoutEffect } from "react";
import { Button } from "antd";
import { xml2jsonElement } from "server/core/xml";
import Page from "server/compiler/Page";
import XmlTemplate from "server/compiler/XmlTemplate";
import TempKeyValMapper from "server/compiler/TempKeyValMapper";
import SourceConfig from "server/compiler/SourceConfig";

const pageFile =
  "/Users/zhangxuyang/mine/one-theme-editor/static/resource/sourceConfig/xiaomi/miui12/wallpaper/desktop.xml";

const xmlTempFile =
  "/Users/zhangxuyang/mine/one-theme-editor/static/resource/sourceConfig/xiaomi/miui12/wallpaper/theme_values.xml";

const xmlTempValFile =
  "/Users/zhangxuyang/mine/one-theme-editor/static/resource/sourceConfig/xiaomi/miui12/wallpaper/value_mapper.xml";
const configFile =
  "/Users/zhangxuyang/mine/one-theme-editor/static/resource/sourceConfig/xiaomi/miui12/description.xml";

const sourceConfigDir =
  "/Users/zhangxuyang/mine/one-theme-editor/static/resource/sourceConfig";
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

    new SourceConfig(configFile).getConfig().then(console.log);
  }, []);
  return (
    <div>
      <Button>测试</Button>
    </div>
  );
};

export default Test;
