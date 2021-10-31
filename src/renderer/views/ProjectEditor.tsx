import path from "path";
import React, { useEffect } from "react";
import { remote } from "electron";
import styled from "styled-components";
import { Empty, Spin } from "antd";
import { Button } from "@/components/One";
import { useInitProject } from "@/hooks/project/index";
import { LOAD_STATUS } from "src/enum";
import { StyleTopDrag } from "@/style";
import createRoot from "@/Root";
import EditorFrame from "@/components/Editor/index";
import electronStoreConfig from "src/store/config";

const ProjectEditor: React.FC = () => {
  const [project, status, handleFetch] = useInitProject();
  useEffect(() => {
    return () => {
      window.$reactiveProjectState.set("projectPath", "");
    };
  }, []);
  useEffect(() => {
    if (!project.projectData) return;
    window.$reactiveProjectState.set("projectData", project.projectData);
    window.$reactiveProjectState.set("projectPath", project.projectData.root);
  }, [project.projectData]);
  useEffect(() => {
    if (!project.resourceConfig) return;
    const resourcePath = path.join(
      electronStoreConfig.get("pathConfig").RESOURCE_CONFIG_DIR,
      project.resourceConfig.namespace
    );
    window.$reactiveProjectState.set("resourcePath", resourcePath);
  }, [project.resourceConfig]);

  switch (status) {
    case LOAD_STATUS.INITIAL:
    case LOAD_STATUS.LOADING: {
      return (
        <StyleEditorEmpty>
          <Spin tip="加载中" />
        </StyleEditorEmpty>
      );
    }
    case LOAD_STATUS.FAILED:
    case LOAD_STATUS.UNKNOWN: {
      const isEmpty = project === null;
      return (
        <StyleEditorEmpty>
          <StyleTopDrag height="50px" />
          <div className="empty">
            <p>{Empty.PRESENTED_IMAGE_SIMPLE}</p>
            {isEmpty ? "暂无主题数据" : "加载失败"}
          </div>
          <div>
            <Button
              type="primary"
              onClick={() => {
                remote.getCurrentWindow().close();
              }}
            >
              返回首页
            </Button>
            <span style={{ margin: "0 10px" }} />
            <Button
              type="primary"
              onClick={() => {
                handleFetch();
              }}
            >
              重试
            </Button>
          </div>
        </StyleEditorEmpty>
      );
    }
    // 进入编辑状态
    default: {
      return <EditorFrame />;
    }
  }
};

const StyleEditorEmpty = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme["@text-color"]};
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;
  }
`;

createRoot(ProjectEditor);
