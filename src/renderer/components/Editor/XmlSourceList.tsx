import React from "react";
import { Tabs } from "antd";
import { ELEMENT_TAG, SOURCE_TYPES } from "src/enum";
import { useSourceTypeList, useSourceDefineMap } from "@/hooks/source";
import XmlController from "@/components/XmlController/index";

const XmlSourceList: React.FC = () => {
  const sourceTypeList = useSourceTypeList();
  const sourceDefineMap = useSourceDefineMap();
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
              {(sourceDefineMap.get(item.tag) || []).map(
                (sourceDefine, key) => {
                  if (sourceDefine.tagName === item.tag) {
                    switch (item.sourceType) {
                      case SOURCE_TYPES.COLOR: {
                        return <XmlController key={key} {...sourceDefine} />;
                      }
                    }
                  }
                  return null;
                }
              )}
            </Tabs.TabPane>
          ))}
      </Tabs>
    </>
  );
};

export default XmlSourceList;
