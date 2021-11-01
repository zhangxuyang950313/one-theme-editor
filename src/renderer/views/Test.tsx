// 测试页面

import React, { useLayoutEffect } from "react";
import { Button } from "antd";
import PageConfigCompiler from "src/common/compiler/PageConfig";
import XmlCompilerExtra from "src/common/compiler/XmlCompilerExtra";
import TempKeyValMapper from "src/common/compiler/TempKeyValMapper";
import ResourceConfigCompiler from "src/common/compiler/ResourceConfig";

const pageFile =
  "/Users/zhangxuyang/mine/one-theme-editor/static/resource/sourceConfig/xiaomi/miui12/wallpaper/desktop.xml";

const xmlTempFile =
  "/Users/zhangxuyang/mine/one-theme-editor/static/resource/sourceConfig/xiaomi/miui12/wallpaper/theme_values.xml";

const xmlTempValFile =
  "/Users/zhangxuyang/mine/one-theme-editor/static/resource/sourceConfig/xiaomi/miui12/wallpaper/value_mapper.xml";
const configFile =
  "/Users/zhangxuyang/mine/one-theme-editor/static/resource/sourceConfig/xiaomi/miui12/description.xml";

const resourceConfigDir =
  "/Users/zhangxuyang/mine/one-theme-editor/static/resource/sourceConfig";
const Test: React.FC = () => {
  useLayoutEffect(() => {
    // const page = new PageConfig(pageFile);
    // console.log(page.getData());

    const xmlTemplate = new XmlCompilerExtra(xmlTempFile);
    const data = xmlTemplate.getElementList();
    const set = new Set(data);
    const has = set.has({ type: "element" });
    console.log({ has });

    const xmlTemplateValue = new TempKeyValMapper(xmlTempValFile);
    // xmlTemplateValue.getTemplateValueData();
    // xmlTemplateValue.getDataList().then(console.log);
    console.log(xmlTemplateValue.getDataMap());

    console.log(new ResourceConfigCompiler(configFile).getConfig());
  }, []);
  return (
    <div>
      <Button>测试</Button>
    </div>
  );
};

export default Test;
