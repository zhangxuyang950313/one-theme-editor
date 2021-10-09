import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { Tabs } from "antd";
import { useResourceList, useResTypeConfigList } from "@/hooks/resource/index";
import { RESOURCE_TYPE } from "src/enum";
import {
  TypeResourceDefinition,
  TypeImageResource,
  TypeXmlValueResource
} from "src/types/resource";
import XmlValueHandler from "./ResourceHandler/XmlValueHandler";
import ImageHandler from "./ResourceHandler/ImageHandler";

const ResourceHandler: React.FC = () => {
  const resTypeList = useResTypeConfigList();
  const resourceList = useResourceList();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const imageListRef = useRef<TypeImageResource[]>([]);
  const xmlValListRef = useRef<TypeXmlValueResource[]>([]);
  const [currentResource, setCurrentRes] = useState<TypeResourceDefinition[]>(
    []
  );

  // 筛选出 resType 类型的所有资源定义
  // 后期加资源类型编辑应在这里加
  useEffect(() => {
    imageListRef.current = [];
    xmlValListRef.current = [];
    resourceList.forEach(resource => {
      if (resource.resType === RESOURCE_TYPE.IMAGE) {
        imageListRef.current.push(resource);
      }
      if (resource.resType === RESOURCE_TYPE.XML_VALUE) {
        xmlValListRef.current.push(resource);
      }
    });
  }, [resourceList]);

  useEffect(() => {
    const currentResType = resTypeList[selectedIndex];
    switch (currentResType.type) {
      case RESOURCE_TYPE.IMAGE: {
        setCurrentRes(imageListRef.current);
        break;
      }
      case RESOURCE_TYPE.XML_VALUE: {
        setCurrentRes(xmlValListRef.current);
        break;
      }
    }
  }, [selectedIndex]);

  const ResourceContent = () => {
    const currentResType = resTypeList[selectedIndex];
    const className = {
      [RESOURCE_TYPE.IMAGE]: "image-container",
      [RESOURCE_TYPE.XML_VALUE]: "xml-value-container"
    }[currentResType.type];
    return (
      <div className={className}>
        {currentResource.map((item, key) => {
          switch (item.resType) {
            case RESOURCE_TYPE.IMAGE: {
              return <ImageHandler key={key} data={item} />;
            }
            case RESOURCE_TYPE.XML_VALUE: {
              if (currentResType.type !== RESOURCE_TYPE.XML_VALUE) return null;
              return (
                <XmlValueHandler
                  key={key}
                  className="item"
                  filterItemTag={currentResType.tag}
                  data={item}
                />
              );
            }
            default: {
              return null;
            }
          }
        })}
      </div>
    );
  };

  return (
    <StyleResourceHandler>
      <Tabs
        className="tabs"
        onChange={index => setSelectedIndex(Number(index))}
      >
        {resTypeList.map((resTypeConfig, index) => (
          <Tabs.TabPane key={index} tab={resTypeConfig.name} />
        ))}
      </Tabs>
      <ResourceContent />
    </StyleResourceHandler>
  );
};

const StyleResourceHandler = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .tabs {
    padding: 0 20px;
    flex-shrink: 0;
    .ant-tabs-nav {
      margin: 0 0 10px 0;
    }
  }
  .image-container {
    display: flex;
    flex-direction: column;
    flex-grow: 0;
    flex-wrap: nowrap;
    padding: 20px;
    overflow-x: hidden;
    overflow-y: auto;
    .item {
      margin: 0 20px 20px 0;
    }
  }
  .xml-value-container {
    display: flex;
    flex-grow: 0;
    flex-wrap: nowrap;
    flex-direction: column;
    padding: 20px;
    overflow-x: hidden;
    overflow-y: auto;
  }
`;

export default ResourceHandler;
