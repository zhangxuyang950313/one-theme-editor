import React from "react";
import { Tabs } from "antd";
import {
  useResDefinitionList,
  useResTypeConfigList
} from "@/hooks/resource/index";
import { RESOURCE_TYPES } from "src/enum";
import XmlValueHandler from "../XmlValueHandler";
import ImageHandler from "../ImageHandler/index";

const ResHandlerList: React.FC = () => {
  const resTypeConfigList = useResTypeConfigList();
  const resDefinitionList = useResDefinitionList();

  return (
    <Tabs>
      {resTypeConfigList.map((resTypeConfig, index) => {
        // // 过滤非图片素材
        // if (resTypeConfig.type === RESOURCE_TYPES.IMAGE) {
        //   return null
        // }
        return (
          <Tabs.TabPane key={index} tab={resTypeConfig.name}>
            {resDefinitionList.map((resDefinition, key) => {
              if (resDefinition.type !== resTypeConfig.type) return null;
              // 和定义的 type 相同会被展示
              switch (resDefinition.type) {
                case RESOURCE_TYPES.IMAGE: {
                  return (
                    <ImageHandler key={key} imageDefinition={resDefinition} />
                  );
                }
                case RESOURCE_TYPES.COLOR:
                case RESOURCE_TYPES.BOOLEAN:
                case RESOURCE_TYPES.STRING:
                case RESOURCE_TYPES.NUMBER: {
                  return (
                    <XmlValueHandler
                      key={key}
                      xmlValueDefinition={resDefinition}
                    />
                  );
                }
                default:
                  return null;
              }
            })}
          </Tabs.TabPane>
        );
      })}
    </Tabs>
  );
};

export default ResHandlerList;
