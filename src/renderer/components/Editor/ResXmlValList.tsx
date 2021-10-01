import React from "react";
import { Tabs } from "antd";
import { IMAGE_RESOURCE_TYPES } from "src/enum";
import { useResourceTypeList } from "@/hooks/resource/index";
import useValueDefinitionList from "@/hooks/resource/useValueDefinitionList";
import XmlController from "../XmlController";

const ResXmlValList: React.FC = () => {
  const resTypeList = useResourceTypeList();
  const valueDefinitionList = useValueDefinitionList();
  console.log({ resTypeList });
  return (
    <Tabs>
      {resTypeList.map((item, index) => {
        // 过滤非图片素材
        if (item.type === IMAGE_RESOURCE_TYPES.IMAGE) return null;
        return (
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
        );
      })}
    </Tabs>
  );
};

export default ResXmlValList;
