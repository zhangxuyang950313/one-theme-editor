import React from "react";
import styled from "styled-components";
import { getCurrentWindow } from "@electron/remote";
import { Empty } from "@arco-design/web-react";

import ProjectDisplay from "./ProjectDisplay";

import type { TypeProjectDataDoc } from "src/types/project";

const ProjectList: React.FC<{ list: TypeProjectDataDoc[] }> = props => {
  const { list } = props;

  const uiVersionMap = list.reduce((prev, item) => {
    const c = prev.get(item.uiVersion.name);
    if (c) prev.set(item.uiVersion.name, [...c, item]);
    else prev.set(item.uiVersion.name, [item]);
    return prev;
  }, new Map<string, TypeProjectDataDoc[]>());
  const uiVersionWrap = Array.from(uiVersionMap.entries());

  return (
    <StyleProjectList>
      {uiVersionWrap.length > 0 ? (
        uiVersionWrap.map(([version, list]) => (
          <div key={version}>
            <h3 className="ui-version">{version}</h3>
            <div className="list-wrapper">
              <div className="list">
                {list.map((item, key) => (
                  <div
                    className="project-card"
                    key={key}
                    onClick={() => {
                      window.$one.$server.openProjectEditorWindow(item.uuid);
                      getCurrentWindow().close();
                    }}
                  >
                    <ProjectDisplay
                      image={`thumbnail://${item.uuid}`}
                      name={item.description.name}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      ) : (
        <Empty className="empty" description="空空如也，开始创作吧！" />
      )}
    </StyleProjectList>
  );
};

const StyleProjectList = styled.div`
  height: 100%;
  overflow-y: auto;
  .ui-version {
    z-index: 2;
    position: sticky;
    top: 0;
    padding: 10px 30px;
    margin: 0;
    color: var(--color-text-1);
    background-color: var(--color-bg-1);
    border-bottom: 1px solid var(--color-border);
  }
  .list-wrapper {
    padding: 10px 30px;
    flex-shrink: 0;
    .list {
      display: flex;
      flex-wrap: wrap;
      flex-grow: 1;
      .project-card {
        margin: 0 8px 8px 0;
        &:hover {
          transform: translateY(-5px);
          transition: 0.3s all ease-out;
          box-shadow: 5px;
        }
        transition: 0.3s all ease-in;
      }
    }
  }
  .empty {
    display: flex;
    height: 100%;
    align-items: center;
  }
`;

export default ProjectList;
