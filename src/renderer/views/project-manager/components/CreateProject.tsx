import path from "path";

import fse from "fs-extra";
import { dialog } from "electron";
import { isDev } from "src/common/utils/index";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useToggle } from "ahooks";
import {
  Modal,
  Form,
  Input,
  Message,
  Button,
  Drawer,
  DrawerProps
} from "@arco-design/web-react";
import { IconFindReplace } from "@arco-design/web-react/icon";
import { TypeProjectDataDoc, TypeProjectInfo } from "src/types/project";
import { TypeResourceConfig } from "src/types/config.resource";
import { FILE_TEMPLATE_TYPE } from "src/common/enums";
import PathUtil from "src/common/utils/PathUtil";

import { useScenarioSelected } from "../hooks";

import TemplateList from "./TemplateLIst";

import Steps from "@/components/Steps";
import ProjectForm from "@/components/ProjectForm";
import ResourceConfigList from "@/components/ResourceConfigList";

// 表单默认值
const txt = `测试text`;
const initialValues = {
  name: isDev ? txt : "",
  designer: isDev ? txt : "",
  author: isDev ? txt : "",
  version: "1.0.0"
};

const defaultPath = PathUtil.ELECTRON_DESKTOP;

// const closeCurrentWindow = (beforeClose?: () => boolean) => {
//   if (beforeClose && beforeClose()) {
//     Modal.confirm({
//       title: "提示",
//       content: "填写的信息将不被保存，确定取消创建主题？",
//       onOk: () => remote.getCurrentWindow().close()
//     });
//   } else {
//     remote.getCurrentWindow().close();
//   }
// };

// 创建主题按钮
const CreateProject: React.FC<{
  drawerProps: DrawerProps;
  onCreated: (x: TypeProjectDataDoc) => void;
}> = props => {
  const { drawerProps } = props;
  const scenario = useScenarioSelected();
  // 当前步骤
  const [curStep, setCurStep] = useState(0);
  // 创建状态
  const [isCreating, creatingStatus] = useToggle(false);
  // 表单实例
  const [form] = Form.useForm<TypeProjectInfo>();
  // 选择的模板
  const [resourceConfig, setResourceConfig] = useState<TypeResourceConfig>();
  // 填写本地目录
  const [localPath, setLocalPath] = useState(
    path.join(defaultPath, initialValues.name)
  );
  // 表单错误列表
  // const [fieldsError, setFieldsError] = useState([]);

  // 资源配置列表
  const { resourceConfigList } = scenario;

  // 工程信息配置
  const projectInfoConfig = scenario.fileTempList.find(
    item => item.type === FILE_TEMPLATE_TYPE.INFO
  );

  // projectInfo
  const projectInfoRef = useRef<TypeProjectInfo>(initialValues);

  useEffect(() => {
    if (!localPath) {
      Message.info("路径不能为空");
      setLocalPath(path.join(defaultPath, form.getFieldValue("name")));
    }
  }, [localPath]);

  // 步骤控制
  const nextStep = () => setCurStep(curStep + 1);
  const prevStep = () => setCurStep(curStep - 1);
  const jumpStep = (step: number) => setCurStep(step);

  // 复位
  const init = () => {
    jumpStep(0);
    setResourceConfig(undefined);
    form.resetFields();
  };

  const selectDir = () => {
    dialog
      .showOpenDialog({
        // https://www.electronjs.org/docs/api/dialog#dialogshowopendialogsyncbrowserwindow-options
        title: "选择工程文件",
        properties: ["openDirectory", "createDirectory", "promptToCreate"]
      })
      .then(result => {
        if (result.canceled) return;
        setLocalPath(
          path.join(result.filePaths[0], form.getFieldValue("name"))
        );
      });
  };

  // 每一步配置
  const steps = [
    {
      name: "主题信息",
      Context: (
        <StyleFillInfo>
          {projectInfoConfig && (
            <ProjectForm
              projectInfoConfig={projectInfoConfig}
              initialValues={initialValues}
              onLocalPathSuggestion={setLocalPath}
              onFormValuesChange={fieldsValue => {
                form.setFieldsValue(fieldsValue);
                Object.assign(projectInfoRef.current, fieldsValue);
              }}
            />
          )}
          {/* 填写信息 */}
          <div className="local-path">
            <p>保存位置</p>
            <div className="input-area">
              <Input
                placeholder="输入或选择目录"
                allowClear
                value={localPath}
                onChange={value => {
                  // form.setFieldsValue({ projectRoot: e.target.value });
                  setLocalPath(value);
                }}
              />
              <Button
                type="primary"
                icon={<IconFindReplace />}
                onClick={selectDir}
              >
                选择
              </Button>
            </div>
          </div>
        </StyleFillInfo>
      ),
      // 取消
      cancel: {
        disabled: isCreating,
        handleCancel: () => drawerProps.onCancel && drawerProps.onCancel()
      },
      next: {
        disabled:
          isCreating /**|| fieldsError.flatMap(o => o.errors).length > 0 */,
        async handleNext() {
          return form
            .validate()
            .then(nextStep)
            .catch(() => {
              Message.info("请填写正确表单");
            });
        }
      }
    },
    {
      name: "选择配置",
      Context: (
        <ResourceConfigList
          resourceConfigList={resourceConfigList}
          selectedKey={resourceConfig?.key || ""}
          onSelected={setResourceConfig}
        />
      ),
      prev: {
        disabled: isCreating,
        handlePrev: prevStep
      },
      next: {
        disabled: !resourceConfig,
        async handleNext() {
          if (!resourceConfig) {
            Message.info("请选择配置模板");
          } else {
            nextStep();
          }
        }
      }
    },
    {
      name: "选择模板",
      Context: <TemplateList />,
      prev: {
        disabled: isCreating,
        handlePrev: prevStep
      },
      // 开始
      start: {
        disabled: isCreating,
        async handleStart() {
          if (!localPath) throw new Error("请选择正确的本地路径");
          if (!fse.existsSync(localPath)) {
            await new Promise<void>(resolve => {
              Modal.confirm({
                title: "提示",
                content: `目录"${localPath}"不存在，是否创建？`,
                onOk: () => {
                  fse.ensureDirSync(localPath);
                  resolve();
                }
              });
            });
          } else if (fse.readdirSync(localPath).length > 0) {
            await new Promise<void>(resolve => {
              Modal.confirm({
                title: "提示",
                content: `目录"${localPath}"为非空目录，可能不是主题目录，是否仍然继续使用此目录？`,
                onOk: () => {
                  resolve();
                }
              });
            });
          }
          if (!resourceConfig) {
            throw new Error("未选择配置模板");
          }
          creatingStatus.setRight();
          const resourceConfigPath = path.join(
            resourceConfig.namespace,
            resourceConfig.src
          );
          return window.$one.$server
            .createProject({
              root: localPath,
              description: projectInfoRef.current,
              scenarioSrc: scenario.src,
              resourceSrc: resourceConfigPath
            })
            .then(data => {
              console.log("创建工程：", data);
              props.onCreated(data);
              // closeCurrentWindow();
              // window.$one.$invoker.sendBroadcast.$projectCreated(data);
            })
            .finally(() => {
              creatingStatus.setLeft();
              setTimeout(init, 300);
            });
        }
      }
    }
  ];

  const step = steps[curStep];

  const CancelButton = () => {
    if (!step.cancel) return null;
    return (
      <Button
        className="button-item"
        onClick={step.cancel.handleCancel}
        disabled={step.cancel.disabled}
      >
        取消
      </Button>
    );
  };

  const PrevButton = () => {
    if (!step.prev) return null;
    return (
      <Button
        className="button-item"
        onClick={step.prev.handlePrev}
        disabled={step.prev.disabled}
      >
        上一步
      </Button>
    );
  };

  const NextButton = () => {
    if (!step.next) return null;
    return (
      <Button
        type="primary"
        className="button-item"
        onClick={step.next.handleNext}
        disabled={step.next.disabled}
        loading={isCreating}
      >
        下一步
      </Button>
    );
  };

  const StartButton = () => {
    if (!step.start) return null;
    return (
      <Button
        type="primary"
        className="button-item"
        onClick={() => {
          step.start
            .handleStart()
            .catch(err => Message.error({ content: err.Message }));
        }}
        disabled={step.start.disabled}
        loading={isCreating}
      >
        开始
      </Button>
    );
  };

  return (
    <Drawer
      width="50%"
      title={`创建${scenario.name}`}
      unmountOnExit
      closable={false}
      footer={[
        <CancelButton key="cancel" />,
        <PrevButton key="prev" />,
        <NextButton key="next" />,
        <StartButton key="start" />
      ]}
      {...drawerProps}
    >
      <StyleCreateProject>
        <div className="container">
          <StyleSteps steps={steps.map(o => o.name)} current={curStep} />
          <div className="content">{step.Context}</div>
        </div>
      </StyleCreateProject>
    </Drawer>
  );
};

const StyleCreateProject = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .container {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    flex-shrink: 1;
    flex-grow: 1;
    overflow: hidden;
    .content {
      height: 100%;
      padding: 20px;
      overflow: hidden;
      overflow-y: auto;
    }
  }
`;

const StyleSteps = styled(Steps)`
  padding: 0 20px;
`;

const StyleFillInfo = styled.div`
  display: flex;
  flex-direction: column;
  /* padding: 0 10px 10px 10px; */
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  .project-input {
    margin-right: 20px;
  }
  .local-path {
    border-top: 0.5px var(--color-primary-light-1) solid;
    padding-top: 20px;
    color: var(--color-text-1);
    .input-area {
      display: flex;
    }
  }
`;

export default CreateProject;
