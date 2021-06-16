import React from "react";
import styled from "styled-components";

import { TypeProjectDescription } from "types/project";

import { Divider } from "antd";
import { projectInfoConfig } from "@/config/editor";

type TypeProps = {
  description: TypeProjectDescription;
};
const ProjectInfo: React.FC<TypeProps> = props => {
  const { description } = props;
  const list = Object.values<{
    key: keyof TypeProjectDescription;
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
      font-weight: 500;
    }
  }
`;

export default ProjectInfo;
