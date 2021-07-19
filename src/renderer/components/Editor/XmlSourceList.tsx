import React from "react";
import { Tabs } from "antd";
import { ELEMENT_TAG, SOURCE_TYPES } from "src/enum";
import { useSourceTypeList, useSourceDefineMap } from "@/hooks/source";
import XmlController from "../XmlController/index";
import BooleanSelector from "../XmlController/BooleanSelector";
import StringInput from "../XmlController/StringInput";
import NumberInput from "../XmlController/NumberInput";
import ImageController from "../ImageController/index";

const XmlSourceList: React.FC = () => {
  const sourceTypeList = useSourceTypeList();
  const sourceDefineMap = useSourceDefineMap();
  return (
    <Tabs>
      {sourceTypeList
        .filter(item => item.tag !== ELEMENT_TAG.IMAGE)
        .map((item, index) => (
          <Tabs.TabPane key={index} tab={item.name}>
            {/* <span style={{ overflow: "auto" }}>
              {JSON.stringify(sourceDefineMap.get(item.tag))}
            </span> */}
            {(sourceDefineMap.get(item.tag) || []).map((sourceDefine, key) => {
              if (sourceDefine.tagName === item.tag) {
                switch (item.sourceType) {
                  // case SOURCE_TYPES.IMAGE: {
                  //   return <ImageController key={key} {...sourceDefine} />;
                  // }
                  // 颜色选择器
                  case SOURCE_TYPES.COLOR: {
                    return <XmlController key={key} {...sourceDefine} />;
                  }
                  // 布尔选择器
                  case SOURCE_TYPES.BOOLEAN: {
                    return <BooleanSelector key={key} {...sourceDefine} />;
                  }
                  // 数字输入器
                  case SOURCE_TYPES.NUMBER: {
                    return <NumberInput key={key} {...sourceDefine} />;
                  }
                  // 未注明的都使用通用的字符串输入器
                  case SOURCE_TYPES.STRING:
                  default: {
                    return <StringInput key={key} {...sourceDefine} />;
                  }
                }
              }
              return null;
            })}
          </Tabs.TabPane>
        ))}
    </Tabs>
  );
};

export default XmlSourceList;
