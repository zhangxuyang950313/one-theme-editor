import React from "react";
import { Tabs } from "antd";
import {
  useResDefinitionList,
  useResTypeConfigList
} from "@/hooks/resource/index";
import { RESOURCE_TYPE } from "src/enum";
import XmlValueHandler from "../XmlValueHandler";
import ImageHandler from "../ImageHandler/index";

const ResHandlerList: React.FC = () => {
  const resTypeList = useResTypeConfigList();
  const resourceList = useResDefinitionList();

  return (
    <Tabs>
      {resTypeList.map((resTypeConfig, index) => {
        // // 过滤非图片素材
        // if (resTypeConfig.type === RESOURCE_TYPES.IMAGE) {
        //   return null
        // }
        return (
          <Tabs.TabPane key={index} tab={resTypeConfig.name}>
            {resourceList.map((resource, key) => {
              if (resource.resType !== resTypeConfig.type) return null;
              // 和定义的 type 相同会被展示
              switch (resource.resType) {
                case RESOURCE_TYPE.IMAGE: {
                  return <ImageHandler key={key} imageDefinition={resource} />;
                }
                case RESOURCE_TYPE.COLOR:
                case RESOURCE_TYPE.BOOLEAN:
                case RESOURCE_TYPE.STRING:
                case RESOURCE_TYPE.NUMBER: {
                  return (
                    <XmlValueHandler key={key} xmlValueDefinition={resource} />
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
