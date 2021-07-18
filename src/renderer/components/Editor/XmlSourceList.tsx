import React from "react";
import { Tabs } from "antd";
import { ELEMENT_TAG } from "src/enum";
import { useSourceTypeList, useSourceDefineList } from "@/hooks/source";
import XmlController from "@/components/XmlController/index";

const XmlSourceList: React.FC = () => {
  const sourceTypeList = useSourceTypeList();
  const sourceDefineList = useSourceDefineList();
  return (
    <>
      <Tabs>
        {sourceTypeList
          .filter(item => item.tag !== ELEMENT_TAG.IMAGE)
          .map((item, index) => (
            <Tabs.TabPane key={index} tab={item.name}>
              {/* {JSON.stringify(
                sourceDefineList.filter(source => source.tagName === item.tag)
              )} */}
              {sourceDefineList
                .filter(source => source.tagName === item.tag)
                .map((sourceDefine, key) => {
                  if (sourceDefine.tagName === item.tag) {
                    return <XmlController key={key} {...sourceDefine} />;
                  }
                  return null;
                })}
            </Tabs.TabPane>
          ))}
      </Tabs>
    </>
  );
};

export default XmlSourceList;
