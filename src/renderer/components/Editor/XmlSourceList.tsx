import React from "react";
import styled from "styled-components";
import { Tabs } from "antd";
import { ELEMENT_TYPES } from "src/enum";
import {
  useXmlSourceList,
  useSourceTypeList,
  useXmlTemplateList
} from "@/hooks/source";
import XmlController from "@/components/XmlController/index";

const XmlSourceList: React.FC = () => {
  const xmlSourceList = useXmlSourceList();
  const sourceTypeList = useSourceTypeList();
  const templateList = useXmlTemplateList();
  return (
    <>
      <Tabs>
        {sourceTypeList
          .filter(item => item.type !== ELEMENT_TYPES.IMAGE)
          .map((item, index) => (
            <Tabs.TabPane key={index} tab={item.name}>
              {/* {templateList.map(item=>item. === )} */}
            </Tabs.TabPane>
          ))}
      </Tabs>
      <SourceXmlSourceList>
        {xmlSourceList.map((sourceConf, key) => (
          <XmlController key={key} {...sourceConf} />
        ))}
      </SourceXmlSourceList>
    </>
  );
};

const SourceXmlSourceList = styled.div``;

export default XmlSourceList;
