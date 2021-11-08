import React from "react";
import styled from "styled-components";

import { TypeProjectInfo } from "src/types/project";

import { Divider } from "@arco-design/web-react";
import { projectInfoConfig } from "@/config/editor";

type TypeProps = {
  description: TypeProjectInfo;
};
const ProjectInfo: React.FC<TypeProps> = props => {
  const { description } = props;
  const list = Object.values<{
    key: keyof TypeProjectInfo;
    name: string;
  }>(projectInfoConfig);
  return (
    <StyleProjectInfo>
      {/* <h3>主题信息</h3> */}
      {list.map(item => (
        <div key={item.key}>
          <div className="description">
            <span className="label">{item.name}：</span>
            <span className="content">{description[item.key]}</span>
          </div>
          <Divider />
        </div>
      ))}
    </StyleProjectInfo>
  );
};

const StyleProjectInfo = styled.div`
  .description {
    display: flex;
    justify-content: space-between;
    .label {
      flex-shrink: 0;
      font-weight: 500;
    }
    .content {
      width: 100%;
      text-align: right;
    }
  }
`;

export default ProjectInfo;
