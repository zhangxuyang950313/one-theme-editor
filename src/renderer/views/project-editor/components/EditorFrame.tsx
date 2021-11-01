import path from "path";
import { remote } from "electron";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Empty, Notification, Message } from "@arco-design/web-react";
import {
  ExportOutlined,
  InfoCircleOutlined,
  MobileOutlined,
  FolderOutlined,
  DeploymentUnitOutlined,
  TagsOutlined,
  TabletOutlined
} from "@ant-design/icons";
import { useToggle } from "ahooks";
import { StyleTopDrag } from "@/style";
import { TOOLS_BAR_BUTTON } from "src/enum";
import { ModuleConfig, PageConfig } from "src/data/ResourceConfig";
import { TypePageConfig } from "src/types/resource.config";
import { TypeIconButtonOption } from "@/components/IconButton";
import { asyncQueue } from "src/common/utils";
import useFetchProjectData from "@/hooks/project/useFetchProjectData";
import useFetchResourceConfig from "@/hooks/resource/useFetchResourceConfig";
import useFetchScenarioConfig from "@/hooks/resource/useFetchScenarioConfig";
import ProjectData from "src/data/ProjectData";
import pathUtil from "src/common/utils/pathUtil";
import EditorToolsBar from "./ToolsBar";
import ModuleSelector from "./ModuleSelector";
import PageSelector from "./PageSelector";
import Previewer from "./Previewer";
import ResourcePanel from "./ResourcePanel";
import StatusBar from "./StatusBar";

// 编辑区域框架
const EditorFrame: React.FC<{ uuid: string }> = props => {
  const [projectInfoVisible, setProjectInfoVisible] = useState(false);

  const [projectData] = useFetchProjectData(props.uuid);
  const [resourceConfig] = useFetchResourceConfig(projectData.resourceSrc);
  const [scenarioConfig] = useFetchScenarioConfig(projectData.scenarioSrc);

  // 栏目开关
  const [displayModuleSelector, setModuleSelector] = useToggle(true);
  const [displayPageSelector, setPageSelector] = useToggle(true);
  const [displayPreviewSelector, setPreviewSelector] = useToggle(true);

  // 当前模块
  const [moduleConfig, setModuleConfig] = useState(ModuleConfig.default);
  // 当前页面
  const [pageConfig, setPageConfig] = useState(PageConfig.default);

  const moduleConfigList = resourceConfig?.moduleList || [];
  const [pageConfigList, setPageConfigList] = useState<TypePageConfig[]>([]);
  const resourceList = pageConfig.resourceList;

  // // 加载当前模块页面配置
  // const [pageConfigList] = useFetchPageConfList(
  //   projectData.resourceSrc,
  //   moduleConfig.pageList.map(item => item.src)
  // );

  // 添加进程间响应式数据
  useEffect(() => {
    if (!projectData) return;
    window.$reactiveState.set("projectData", projectData);
    window.$reactiveState.set("projectPath", projectData.root);
    return () => {
      window.$reactiveState.set("projectData", ProjectData.default);
      window.$reactiveState.set("projectPath", "");
    };
  }, [projectData]);

  useEffect(() => {
    if (!resourceConfig) return;
    const resourcePath = path.join(
      pathUtil.RESOURCE_CONFIG_DIR,
      resourceConfig.namespace
    );
    window.$reactiveState.set("resourcePath", resourcePath);
  }, [resourceConfig]);

  // 模块默认选第一个
  useEffect(() => {
    if (!moduleConfigList[0]) return;
    setModuleConfig(moduleConfigList[0]);
  }, [moduleConfigList]);

  // 页面默认选第一个, 没有使用默认
  useEffect(() => {
    setPageConfig(pageConfigList[0] || PageConfig.default);
  }, [pageConfigList]);

  // 加载当前模块页面配置
  useEffect(() => {
    if (!projectData.resourceSrc) return;
    const pageConfDataQueue = moduleConfig.pageList.map(item => async () => {
      const data = await window.$server.getPageConfigList({
        namespace: path.dirname(projectData.resourceSrc),
        config: item.src
      });
      // dispatch(ActionPatchPageConfMap(data));
      return data;
    });
    asyncQueue(pageConfDataQueue)
      .then(setPageConfigList)
      .catch(err => Notification.error({ content: err.message }));
  }, [projectData.resourceSrc, moduleConfig]);

  // useEffect(() => {},[pageConfig])

  // 工具栏按钮左侧
  const [leftButtons] = useState<TypeIconButtonOption[]>([
    {
      name: TOOLS_BAR_BUTTON.MODULE_TOGGLE,
      icon: <DeploymentUnitOutlined />,
      defaultToggle: displayModuleSelector,
      onClick: setModuleSelector.toggle
    },
    {
      name: TOOLS_BAR_BUTTON.PAGE_TOGGLE,
      icon: <TagsOutlined />,
      defaultToggle: displayPageSelector,
      onClick: setPageSelector.toggle
    },
    {
      name: TOOLS_BAR_BUTTON.PREVIEW_TOGGLE,
      icon: <TabletOutlined />,
      defaultToggle: displayPreviewSelector,
      onClick: setPreviewSelector.toggle
    }
    // { name: TOOLS_BAR_BUTTON.PLACEHOLDER, icon: <div /> }
    // { name: TOOLS_BAR_BUTTON.DARK, icon: <InfoCircleOutlined /> },
    // { name: TOOLS_BAR_BUTTON.LIGHT, icon: <InfoCircleOutlined /> }
  ]);
  // 工具栏按钮右侧
  const [rightButtons] = useState<TypeIconButtonOption[]>([
    { name: TOOLS_BAR_BUTTON.APPLY, icon: <MobileOutlined /> },
    { name: TOOLS_BAR_BUTTON.SAVE, icon: <FolderOutlined /> },
    {
      name: TOOLS_BAR_BUTTON.EXPORT,
      icon: <ExportOutlined />,
      onClick: () => {
        const { root, description, scenarioSrc } = projectData;
        const { extname } = scenarioConfig.packageConfig;
        const defaultPath = path.join(
          path.dirname(projectData.root),
          `${description.name}.${extname}`
        );
        remote.dialog
          // https://www.electronjs.org/docs/api/dialog#dialogshowopendialogsyncbrowserwindow-options
          .showSaveDialog({
            properties: ["createDirectory"],
            defaultPath,
            filters: [{ name: extname, extensions: [extname] }]
          })
          .then(result => {
            if (result.canceled) return;
            if (!result.filePath) {
              Message.info("未指定任何文件");
              return;
            }
            // packProject(
            //   {
            //     scenarioSrc,
            //     packDir: root,
            //     outputFile: result.filePath
            //   },
            //   data => {
            //     notification.info({
            //       message: data.msg,
            //       description: data.data
            //     });
            //   }
            // );
          });
      }
    },
    {
      name: TOOLS_BAR_BUTTON.INFO,
      icon: <InfoCircleOutlined />,
      onClick: () => {
        setProjectInfoVisible(true);
      }
    }
  ]);

  return (
    <StyleEditorFrame>
      <StyleTopBar height="30px">
        <span className="title">{document.title || "一个主题编辑器"}</span>
      </StyleTopBar>
      {/* 工具栏 */}
      <EditorToolsBar
        className="editor__tools-bar"
        buttonsGroupList={[leftButtons, rightButtons]}
      />
      {/* <ProjectInfoModal
        title="修改主题信息"
        centered
        destroyOnClose
        getContainer={thisRef.current || false}
        visible={projectInfoVisible}
        onCancel={() => setProjectInfoVisible(false)}
        onOk={() => setProjectInfoVisible(false)}
      /> */}
      <div className="editor__container">
        {/* 模块选择器 */}
        {displayModuleSelector && (
          <div className="editor__module-selector right-border-line">
            {moduleConfigList.length ? (
              <ModuleSelector
                className="editor__module-content"
                moduleConfigList={moduleConfigList}
                currentModule={moduleConfig}
                onChange={setModuleConfig}
              />
            ) : (
              <div className="no-config">无模块</div>
            )}
          </div>
        )}
        {/* 编辑区域 */}
        <div className="editor__content-wrapper">
          {/* 主编辑区域 */}
          <div className="editor__content">
            {/* 页面选择器 */}
            {displayPageSelector && (
              <div className="editor__page-selector right-border-line">
                {moduleConfig.pageList.length ? (
                  <PageSelector
                    className="editor__page-content"
                    pageConfigList={pageConfigList}
                    onChange={setPageConfig}
                  />
                ) : (
                  <div className="no-config">无页面</div>
                )}
              </div>
            )}
            {/* 预览 */}
            {/* TODO: 占位图 */}
            {displayPreviewSelector && (
              <div className="editor__previewer right-border-line">
                {pageConfig.config ? (
                  <Previewer
                    className="previewer__content"
                    pageConfig={pageConfig}
                    canClick
                    useDash
                  />
                ) : (
                  <div className="no-config">无预览</div>
                )}
              </div>
            )}
            {/* 资源编辑区 */}
            <div className="resource-panel ">
              {pageConfig.config ? (
                <ResourcePanel
                  pageConfig={pageConfig}
                  resourceList={resourceList}
                />
              ) : (
                <Empty className="no-config" description="无资源配置" />
              )}
            </div>
          </div>
        </div>
      </div>
      {/* 底部工具栏 */}
      <StatusBar className="editor__status-bar" />
    </StyleEditorFrame>
  );
};

const StyleTopBar = styled(StyleTopDrag)`
  position: unset;
  flex-shrink: 0;
  padding: 0 100px;
  display: flex;
  background-color: ${({ theme }) => theme["@background-color-thirdly"]};
  border-bottom: 1px solid ${({ theme }) => theme["@border-color-thirdly"]};
  .title {
    margin: auto;
    color: ${({ theme }) => theme["@text-color"]};
  }
`;

const StyleEditorFrame = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  --border-color-thirdly: ${({ theme }) => theme["@border-color-thirdly"]};
  --bg-color-thirdly: ${({ theme }) => theme["@background-color-thirdly"]};
  --bg-color-secondary: ${({ theme }) => theme["@background-color-secondary"]};
  .right-border-line {
    border-right: 1px solid var(--border-color-thirdly);
  }
  .no-config {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme["@disabled-color"]};
  }
  .editor__tools-bar {
    background-color: var(--bg-color-thirdly);
    border-bottom: 1px solid var(--border-color-thirdly);
  }
  .editor__container {
    height: 100%;
    display: flex;
    overflow-y: hidden;

    .editor__module-selector {
      flex-shrink: 0;
      width: 80px;
      overflow-y: auto;
      overflow-x: hidden;
      background-color: var(--bg-color-thirdly);
      .editor__module-content {
        width: 80px;
        margin: 0 auto;
        padding: 10px 0;
      }
    }
    .editor__content-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-x: auto;
      .editor__content {
        display: flex;
        flex-grow: 1;
        overflow-y: auto;
        box-sizing: border-box;
        transition: 0.3s ease-out;
        .editor__page-selector {
          flex-shrink: 0;
          width: 120px;
          padding: 10px;
          overflow-y: auto;
          background-color: var(--bg-color-secondary);
          .editor__page-content {
            width: 100px;
          }
        }
        .editor__previewer {
          flex-shrink: 0;
          padding: 20px;
          overflow-y: auto;
          width: 340px;
          background-color: var(--bg-color-secondary);
          .previewer__content {
            width: 300px;
          }
        }
        .resource-panel {
          flex: 1;
          flex-shrink: 0;
          overflow-y: auto;
          background-color: var(--bg-color-thirdly);
        }
      }
    }
  }
  .editor__status-bar {
    flex-grow: 1;
    flex-shrink: 0;
    height: 30px;
    border-top: 1px solid var(--border-color-thirdly);
    background-color: var(--bg-color-thirdly);
  }
`;

export default EditorFrame;
