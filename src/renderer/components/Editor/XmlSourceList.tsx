import React from "react";
import { Tabs } from "antd";
import { RESOURCE_TYPES } from "src/enum";
import { useResourceTypeList } from "@/hooks/resource/index";
import useValueDefinitionList from "@/hooks/resource/useValueDefinitionList";
import XmlController from "../XmlController";

const XmlSourceList: React.FC = () => {
  const resourceTypeList = useResourceTypeList();
  const valueDefinitionList = useValueDefinitionList();
  return (
    <Tabs>
      {resourceTypeList
        // 过滤非图片素材
        .flatMap(item => (item.type === RESOURCE_TYPES.IMAGE ? [] : [item]))
        .map((item, index) => (
          <Tabs.TabPane key={index} tab={item.name}>
            {valueDefinitionList
              .filter(o => o.tagName === item.tag)
              .map((valueDefinition, key) => {
                // 和定义的 tag 相同会被展示
                if (valueDefinition.tagName === item.tag) {
                  return (
                    <XmlController
                      key={key}
                      resourceType={item.type}
                      valueDefinition={valueDefinition}
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
