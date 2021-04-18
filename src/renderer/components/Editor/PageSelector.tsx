import React from "react";
import styled from "styled-components";

import { Collapse } from "antd";
import { TypeTempPreviewClassConf } from "@/types/project";

// 页面选择器
type TypeProps = {
  previewClass: TypeTempPreviewClassConf[];
};
const PageSelector: React.FC<TypeProps> = props => {
  const { previewClass } = props;
  return (
    <StylePageSelector>
      <Collapse
        bordered={false}
        defaultActiveKey={Object.keys(previewClass).map(o => Number(o))}
      >
        {previewClass.map((item, key) => {
          return (
            <Collapse.Panel header={item.name} key={key}>
              <StylePagePreview>
                {item.pages.map(page => {
                  // const pageConf = getPageConfByKey(page);
                  // if (!pageConf?.conf?.cover) return null;
                  // const imageData = getImageDataByKey(pageConf.conf.cover);
                  return (
                    <img className="image" src={""} key={page} alt={page} />
                  );
                })}
              </StylePagePreview>
            </Collapse.Panel>
          );
        })}
      </Collapse>
    </StylePageSelector>
  );
};

const StylePageSelector = styled.div`
  width: 360px;
`;

const StylePagePreview = styled.div`
  display: flex;
  justify-content: space-around;
  .image {
    cursor: pointer;
    width: 40%;
  }
`;

export default PageSelector;
