import React from "react";
import { Tabs } from "antd";
import { ELEMENT_TAG } from "src/enum";
import {
  useTextSourceList,
  useSourceTypeList,
  useXmlTemplateList
} from "@/hooks/source";
import XmlController from "@/components/XmlController/index";

const XmlSourceList: React.FC = () => {
  const xmlSourceList = useTextSourceList();
  const sourceTypeList = useSourceTypeList();
  const templateList = useXmlTemplateList();
  return (
    <>
      <Tabs>
        {sourceTypeList
          .filter(item => item.tag !== ELEMENT_TAG.IMAGE)
          .map((item, index) => (
            <Tabs.TabPane key={index} tab={item.name}>
              {/* {templateList.map(item=>item. === )} */}
            </Tabs.TabPane>
          ))}
      </Tabs>
      <>
        {xmlSourceList.map((sourceConf, key) => (
          <XmlController key={key} {...sourceConf} />
        ))}
      </>
    </>
  );
};

export default XmlSourceList;
