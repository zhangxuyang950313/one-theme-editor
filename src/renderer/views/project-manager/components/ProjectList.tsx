import React from "react";
import styled from "styled-components";
import { remote } from "electron";
import { Empty } from "@arco-design/web-react";
import { TypeProjectDataDoc } from "src/types/project";
import ProjectCard from "./ProjectCard";

const ProjectList: React.FC<{ list: TypeProjectDataDoc[] }> = props => {
  const { list } = props;
  return (
    <StyleProjectList>
      {list.length > 0 ? (
        <div className="list">
          {list.map((item, key) => (
            <div className="project-card" key={key}>
              <ProjectCard
                hoverable
                data={item}
                onClick={async () => {
                  await window.$server.openProjectEditorWindow(item.uuid);
                  remote.getCurrentWindow().close();
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <Empty className="empty" description="空空如也，开始创作吧！" />
      )}
    </StyleProjectList>
  );
};

const StyleProjectList = styled.div`
  height: 100%;
  .list {
    display: flex;
    flex-wrap: wrap;
    flex-grow: 0;
    padding: 20px 30px 0 30px;
    overflow-y: auto;
    .project-card {
      margin: 0 20px 20px 0;
    }
  }
  .empty {
    display: flex;
    height: 100%;
    align-items: center;
  }
`;

export default ProjectList;
