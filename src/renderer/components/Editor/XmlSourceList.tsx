import React from "react";
import { Tabs } from "antd";
import { SOURCE_TYPES } from "src/enum";
import { useSourceTypeList, useSourceDefineValueList } from "@/hooks/source";
import XmlController from "../XmlController";

const XmlSourceList: React.FC = () => {
  const sourceTypeList = useSourceTypeList();
  const sourceDefineValueList = useSourceDefineValueList();
  return (
    <Tabs>
      {sourceTypeList
        // 过滤非图片素材
        .flatMap(item => (item.type === SOURCE_TYPES.IMAGE ? [] : [item]))
        .map((item, index) => (
          <Tabs.TabPane key={index} tab={item.name}>
            {sourceDefineValueList
              .filter(o => o.tagName === item.tag)
              .map((sourceDefineValue, key) => {
                // 和定义的 tag 相同会被展示
                if (sourceDefineValue.tagName === item.tag) {
                  return (
                    <XmlController
                      key={key}
                      sourceType={item.type}
                      sourceDefineValue={sourceDefineValue}
                    />
                  );
                }
                return null;
              })}
          </Tabs.TabPane>
        ))}
    </Tabs>
  );
};

export default XmlSourceList;
