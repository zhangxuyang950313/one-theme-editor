import path from "path";
import fse from "fs-extra";
import { dialog, remote } from "electron";

import { isDev } from "src/common/utils/index";
import { useQuey } from "@/hooks";
import { TypeProjectInfo } from "src/types/project";
import { TypeResourceOption } from "src/types/resource.config";

import styled from "styled-components";
import React, { useEffect, useRef, useState } from "react";
import { Modal, Form, Input, Message, Button } from "@arco-design/web-react";
import { IconClose, IconFolderAdd } from "@arco-design/web-react/icon";
import { FILE_TEMPLATE_TYPE } from "src/enum";
import Steps from "@/components/Steps";
import RootWrapper from "@/RootWrapper";
import ResourceConfigManager from "@/components/ResourceConfigManager";
import useFetchResourceOptionList from "@/hooks/resource/useFetchResourceOptionList";
import useFetchScenarioOption from "@/hooks/resource/useFetchScenarioOption";
import pathUtil from "src/common/utils/pathUtil";
import ProjectForm from "./components/ProjectForm";

// 表单默认值
// const txt = `测试${UUID()}`;
const txt = `测试text`;
const initialValues = {
  name: isDev ? txt : "",
  designer: isDev ? txt : "",
  author: isDev ? txt : "",
  version: "1.0.0",
  uiVersion: "10"
};

const defaultPath = pathUtil.ELECTRON_DESKTOP;

const closeCurrentWindow = (beforeClose?: () => boolean) => {
  if (beforeClose && beforeClose()) {
    Modal.confirm({
      title: "提示",
      content: "填写的信息将不被保存，确定取消创建主题？",
      onOk: () => remote.getCurrentWindow().close()
    });
  } else {
    remote.getCurrentWindow().close();
  }
};

// 创建主题按钮
const CreateProject: React.FC = () => {
  const { scenarioSrc = "", scenarioName = "" } =
    useQuey<{ scenarioSrc?: string; scenarioName?: string }>();
  // 当前步骤
  const [curStep, setCurStep] = useState(0);
  // 创建状态
  const [isCreating, updateCreating] = useState(false);
  // 表单实例
  const [form] = Form.useForm<TypeProjectInfo>();
  // 选择的模板
  const [resourceConfig, setResourceConfig] = useState<TypeResourceOption>();
  // 填写本地目录
  const [localPathForSave, setLocalPathForSave] = useState(
    path.join(defaultPath, initialValues.name)
  );
  // 表单错误列表
  // const [fieldsError, setFieldsError] = useState([]);

  // 机型配置
  const [scenarioOption] = useFetchScenarioOption(scenarioSrc);

  // 配置列表
  const [resourceOptionList] = useFetchResourceOptionList(scenarioSrc);

  // 工程信息配置
  const projectInfoConfig = scenarioOption.fileTempList.find(
    item => item.type === FILE_TEMPLATE_TYPE.INFO
  );

  // projectInfo
  const projectInfoRef = useRef<TypeProjectInfo>({});

  useEffect(() => {
    if (!localPathForSave) {
      Message.info("路径不能为空");
      setLocalPathForSave(path.join(defaultPath, form.getFieldValue("name")));
    }
  }, [localPathForSave]);

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
        setLocalPathForSave(
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
              onLocalPathSuggestion={setLocalPathForSave}
              onFormValuesChange={fieldsValue => {
                form.setFieldsValue(fieldsValue);
                Object.assign(projectInfoRef.current, fieldsValue);
              }}
            />
          )}
          {/* 填写信息 */}
          <StyleSetLocalPath>
            <p>本地目录</p>
            <div className="input-area">
              <Input
                placeholder="输入或选择目录"
                allowClear
                value={localPathForSave}
                onChange={value => {
                  // form.setFieldsValue({ projectRoot: e.target.value });
                  setLocalPathForSave(value);
                }}
              />
              <Button
                type="primary"
                icon={<IconFolderAdd />}
                onClick={selectDir}
              >
                选择
              </Button>
            </div>
          </StyleSetLocalPath>
        </StyleFillInfo>
      ),
      // 取消
      cancel: {
        disabled: isCreating,
        handleCancel: () => closeCurrentWindow(() => true)
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
        <ResourceConfigManager
          className="resource-config-manager"
          resourceOptionList={resourceOptionList}
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
      Context: null,
      prev: {
        disabled: isCreating,
        handlePrev: prevStep
      },
      // 开始
      start: {
        disabled: isCreating,
        async handleStart() {
          if (!localPathForSave) throw new Error("请选择正确的本地路径");
          if (!fse.existsSync(localPathForSave)) {
            await new Promise<void>(resolve => {
              Modal.confirm({
                title: "提示",
                content: `目录"${localPathForSave}"不存在，是否创建？`,
                onOk: () => {
                  fse.ensureDirSync(localPathForSave);
                  resolve();
                }
              });
            });
          } else if (fse.readdirSync(localPathForSave).length > 0) {
            await new Promise<void>(resolve => {
              Modal.confirm({
                title: "提示",
                content: `目录"${localPathForSave}"为非空目录，可能不是主题目录，是否仍然继续使用此目录？`,
                onOk: () => {
                  resolve();
                }
              });
            });
          }
          if (!resourceConfig) {
            throw new Error("未选择配置模板");
          }
          updateCreating(true);
          const resourceConfigPath = path.join(
            resourceConfig.namespace,
            resourceConfig.config
          );
          return window.$server
            .createProject({
              root: localPathForSave,
              description: projectInfoRef.current,
              scenarioMd5: scenarioOption.md5,
              scenarioSrc: scenarioOption.src,
              resourceSrc: resourceConfigPath
            })
            .then(data => {
              console.log("创建工程：", data);
              closeCurrentWindow();
              window.$server.sendBroadcast.$projectCreated(data);
            })
            .finally(() => {
              updateCreating(false);
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
        // loading={isCreating}
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
        // loading={isCreating}
      >
        开始
      </Button>
    );
  };

  return (
    <StyleCreateProject>
      <span className="title">
        创建{decodeURI(scenarioName) || "工程"}
        <IconClose
          className="close-btn"
          onClick={() => closeCurrentWindow(() => true)}
        />
      </span>
      <div className="content">
        <StyleSteps steps={steps.map(o => o.name)} current={curStep} />
        {step.Context}
      </div>
      {/* 弹框底部控制按钮 */}
      <div className="footer-buttons">
        <CancelButton key="cancel" />
        <PrevButton key="prev" />
        <NextButton key="next" />
        <StartButton key="start" />
      </div>
    </StyleCreateProject>
  );
};

const StyleCreateProject = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 20px;
    color: var(--color-text-1);
    border-bottom: 1px var(--color-border-1) solid;
    .close-btn {
      font-size: 20px;
      &:hover {
        cursor: pointer;
        background-color: var(--color-border-1);
      }
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    flex-shrink: 1;
    flex-grow: 1;
    overflow: hidden;
    .resource-config-manager {
      padding: 0 30px;
    }
  }
  .footer-buttons {
    display: flex;
    justify-content: flex-end;
    padding: 15px 30px;
    border-top: 1px var(--color-border-1) solid;
    .button-item {
      margin-left: 10px;
    }
  }
`;

const StyleSteps = styled(Steps)`
  padding: 20px 30px;
`;

const StyleSetLocalPath = styled.div`
  border-top: 0.5px var(--color-border-1) solid;
  padding-top: 20px;
  color: var(--color-text-1);
  .input-area {
    display: flex;
  }
`;

const StyleFillInfo = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 30px 30px 30px;
  width: 100%;
  overflow-y: auto;
  .project-input {
    margin-right: 20px;
  }
`;

RootWrapper(CreateProject);
