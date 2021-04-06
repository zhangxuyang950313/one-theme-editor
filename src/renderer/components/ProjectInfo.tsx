import React from "react";
import styled from "styled-components";

import { TypeProjectInfo } from "@/types/project";

import { Divider } from "antd";
import { projectInfoConfig } from "@/config/project";

type TypeProps = {
  projectInfo: TypeProjectInfo;
};
function ProjectInfo(props: TypeProps): JSX.Element {
  const { projectInfo } = props;
  const list = Object.values<{ key: keyof TypeProjectInfo; name: string }>(
    projectInfoConfig
  );
  return (
    <StyleProjectInfo>
      {/* <h3>主题信息</h3> */}
      {list.map(item => (
        <>
          <div className="description" key={item.key}>
            <span className="label">{item.name}：</span>
            <span className="content">{projectInfo[item.key]}</span>
          </div>
          <Divider />
        </>
      ))}
    </StyleProjectInfo>
  );
}

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
