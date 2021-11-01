import path from "path";
import { remote } from "electron";
import React, { useEffect } from "react";
import styled from "styled-components";
import { Empty, Spin } from "@arco-design/web-react";
import { Button } from "@/components/one-ui";
import { LOAD_STATUS } from "src/enum";
import { StyleTopDrag } from "@/style";
import RootWrapper from "@/RootWrapper";
import electronStoreConfig from "src/store/config";
import { useQuey } from "@/hooks";
import useFetchProjectData from "@/hooks/project/useFetchProjectData";
import EditorFrame from "./components/EditorFrame";

const ProjectEditor: React.FC = () => {
  const { uuid = "" } = useQuey<{ uuid?: string }>();
  return <EditorFrame uuid={uuid} />;
};

const ProjectEditor1: React.FC = () => {
  const { uuid = "" } = useQuey<{ uuid?: string }>();
  const [projectData] = useFetchProjectData(uuid);

  useEffect(() => {
    return () => {
      window.$reactiveState.set("projectPath", "");
    };
  }, []);

  useEffect(() => {
    if (!projectData) return;
    window.$reactiveState.set("projectData", projectData);
    window.$reactiveState.set("projectPath", projectData.root);
  }, [projectData]);

  useEffect(() => {
    if (!resourceConfig) return;
    const resourcePath = path.join(
      electronStoreConfig.get("pathConfig").RESOURCE_CONFIG_DIR,
      resourceConfig.namespace
    );
    window.$reactiveState.set("resourcePath", resourcePath);
  }, [resourceConfig]);

  switch (status) {
    case LOAD_STATUS.INITIAL:
    case LOAD_STATUS.LOADING: {
      return (
        <StyleEditorEmpty>
          <Spin tip="加载中" size={30} />
        </StyleEditorEmpty>
      );
    }
    case LOAD_STATUS.FAILED:
    case LOAD_STATUS.UNKNOWN: {
      const isEmpty = !projectData;
      return (
        <StyleEditorEmpty>
          <StyleTopDrag height="50px" />
          <Empty
            className="empty"
            description={isEmpty ? "暂无主题数据" : "加载失败"}
          />
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
      return <EditorFrame uuid={uuid} />;
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
  -webkit-app-region: drag;
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;
  }
`;

RootWrapper(ProjectEditor);
