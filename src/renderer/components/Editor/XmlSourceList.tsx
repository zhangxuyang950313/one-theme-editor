import React from "react";
import { Tabs } from "antd";
import { RESOURCE_TYPES } from "src/enum";
import { useResourceTypeList } from "@/hooks/resource/index";
import useValueDefinedList from "@/hooks/resource/useValueDefinedList";
import XmlController from "../XmlController";

const XmlSourceList: React.FC = () => {
  const resourceTypeList = useResourceTypeList();
  const valueDefineList = useValueDefinedList();
  return (
    <Tabs>
      {resourceTypeList
        // 过滤非图片素材
        .flatMap(item => (item.type === RESOURCE_TYPES.IMAGE ? [] : [item]))
        .map((item, index) => (
          <Tabs.TabPane key={index} tab={item.name}>
            {valueDefineList
              .filter(o => o.tagName === item.tag)
              .map((valueDefined, key) => {
                // 和定义的 tag 相同会被展示
                if (valueDefined.tagName === item.tag) {
                  return (
                    <XmlController
                      key={key}
                      resourceType={item.type}
                      valueDefined={valueDefined}
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
