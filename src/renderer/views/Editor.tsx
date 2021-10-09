import React, { useEffect } from "react";
import styled from "styled-components";
import { useHistory } from "react-router";
import { Button, Empty, Spin } from "antd";
import { StyleBorderRight } from "@/style";
import { useInitProject } from "@/hooks/project/index";
import { LOAD_STATUS } from "src/enum";
import ModuleSelector from "@/components/Editor/ModuleSelector";
import EditorToolsBar from "@/components/Editor/ToolsBar";
import EditorContainer from "@/components/Editor/index";
import { useResourceList } from "@/hooks/resource";
// import usePatchPageSourceData from "@/hooks/project/usePatchPageSourceData";
// import usePatchProjectInfoData from "@/hooks/project/usePatchProjectInfoData";
// import useWatchFiles from "@/hooks/project/useWatchFiles";

const Editor: React.FC = () => {
  const history = useHistory();
  const [projectData, status, handleFetch] = useInitProject();
  const resourceList = useResourceList();

  useEffect(() => {
    if (!resourceList.length) return;
    // subscribeFile(resourceList[0].sourceData.src, evt => {
    //   console.log(1, { evt });
    // });
    // subscribeFile(resourceList[1].sourceData.src, evt => {
    //   console.log(2, { evt });
    // });
  }, [resourceList]);
  // const handleWatchFiles = useWatchFiles();
  // usePatchPageSourceData();
  // usePatchProjectInfoData();
  // useWatchProjectFiles();
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
      const isEmpty = projectData === null;
      return (
        <StyleEditorEmpty>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={isEmpty ? "暂无主题数据" : "加载失败"}
          />
          <div>
            <Button
              type="primary"
              onClick={() => {
                history.replace("/");
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
    default: {
      // 进入编辑状态
      return (
        <StyleEditor>
          {/* 模块选择器 */}
          <StyleModuleSelector>
            <div className="module-selector-container">
              <ModuleSelector />
            </div>
          </StyleModuleSelector>
          {/* 编辑区域 */}
          <StyleEditorContent>
            {/* 工具栏 */}
            <EditorToolsBar />
            {/* 主编辑区域 */}
            <EditorContainer />
          </StyleEditorContent>
        </StyleEditor>
      );
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
`;

const StyleEditor = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
`;

const StyleModuleSelector = styled(StyleBorderRight)`
  overflow-y: auto;
  flex-shrink: 0;
  padding: 80px 0;
  .module-selector-container {
    width: 80px;
  }
`;

const StyleEditorContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: auto;
`;

export default Editor;
