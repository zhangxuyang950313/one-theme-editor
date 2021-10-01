import path from "path";
import fse from "fs-extra";
import { v4 as UUID } from "uuid";
import { remote } from "electron";

import { isDev } from "@/core/constant";
import { apiCreateProject } from "@/request";
import { useScenarioOption } from "@/hooks/resource/index";
import { TypeProjectInfo } from "src/types/project";
import { TypeResourceOption } from "src/types/resource";

import styled from "styled-components";
import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Form, Input, message } from "antd";
import { FieldError } from "rc-field-form/lib/interface";
import { FileAddOutlined } from "@ant-design/icons";
import Steps from "@/components/Steps";
import { useEditorSelector, useStarterSelector } from "@/store";
import { FILE_TEMPLATE_TYPE } from "src/enum";
import { ProjectInput } from "../Forms";
import ResourceConfigManager from "./ResourceConfigManager";

// 表单默认值
const txt = `测试${UUID()}`;
const initialValues = {
  name: isDev ? txt : "",
  designer: isDev ? txt : "",
  author: isDev ? txt : "",
  version: "1.0.0",
  uiVersion: "10"
};

const defaultPath = remote.app.getPath("desktop");

// 创建主题按钮
const CreateProject: React.FC<{
  onProjectCreated: (projectInfo: TypeProjectInfo) => Promise<void>;
}> = props => {
  // 机型配置
  const [currentScenario] = useScenarioOption();
  // 弹框控制
  const [modalVisible, setModalVisible] = useState(false);
  // 当前步骤
  const [curStep, setCurStep] = useState(0);
  // 创建状态
  const [isCreating, updateCreating] = useState(false);
  // 表单实例
  const [form] = Form.useForm<TypeProjectInfo>();
  // 选择的模板
  const [resourceConfig, setResourceConfig] = useState<TypeResourceOption>();
  // 填写本地目录
  const [projectRoot, setProjectRoot] = useState(
    path.join(defaultPath, initialValues.name)
  );
  // 表单错误列表
  const [fieldsError, setFieldsError] = useState<FieldError[]>([]);

  // 工程信息配置
  const projectInfoConfig = useStarterSelector(state =>
    state.scenarioOptionSelected.fileTempList.find(
      item => item.type === FILE_TEMPLATE_TYPE.INFO
    )
  );

  // 当前按钮组件
  const thisRef = useRef<HTMLElement | null>(null);

  // projectInfo
  const projectInfoRef = useRef<TypeProjectInfo>({});

  useEffect(() => {
    if (!projectRoot) {
      message.warn("路径不能为空");
      setProjectRoot(path.join(defaultPath, form.getFieldValue("name")));
    }
  }, [projectRoot]);

  // 步骤控制
  const nextStep = () => setCurStep(curStep + 1);
  const prevStep = () => setCurStep(curStep - 1);
  const jumpStep = (step: number) => setCurStep(step);

  // 弹框控制
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  // 复位
  const init = () => {
    jumpStep(0);
    setResourceConfig(undefined);
    form.resetFields();
  };

  // 开始创建主题
  const handleStartCreate = () => {
    // init();
    openModal();
  };

  const selectDir = () => {
    remote.dialog
      .showOpenDialog({
        // https://www.electronjs.org/docs/api/dialog#dialogshowopendialogsyncbrowserwindow-options
        title: "选择工程文件",
        properties: ["openDirectory", "createDirectory", "promptToCreate"]
      })
      .then(result => {
        if (result.canceled) return;
        setProjectRoot(
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
          {/* 填写信息 */}
          {projectInfoConfig && (
            <Form
              form={form}
              colon={false}
              labelAlign="right"
              labelCol={{ span: 4 }}
              // <Modal /> 和 Form 一起配合使用时，
              // 设置 destroyOnClose 也不会在 Modal 关闭时销毁表单字段数据，
              // 需要设置 <Form preserve={false} />
              preserve={false}
              initialValues={initialValues}
              onValuesChange={(changedValue: TypeProjectInfo) => {
                const projectName = changedValue.name;
                if (!projectName) return;
                if (path.basename(projectRoot) === projectName) return;
                // 非绝对路径使用默认路径
                if (!path.isAbsolute(projectRoot)) {
                  setProjectRoot(path.join(defaultPath, projectName));
                  return;
                }
                // 路径存在视为目标根路径，向后追加工程名称
                if (fse.pathExistsSync(projectRoot)) {
                  setProjectRoot(path.join(projectRoot, projectName));
                  return;
                }
                // 当前路径不存在且向上一级路径存在视为当前的目标路径，替换最后一级路径
                const dirname = path.dirname(projectRoot);
                if (fse.pathExistsSync(dirname)) {
                  setProjectRoot(path.join(dirname, projectName));
                  return;
                }
              }}
              onFieldsChange={() => {
                setFieldsError(form.getFieldsError());
                projectInfoRef.current = form.getFieldsValue();
              }}
            >
              {projectInfoConfig.items.map(prop => {
                return (
                  prop.visible && (
                    <ProjectInput
                      key={prop.name}
                      name={prop.name}
                      label={prop.description}
                      disabled={prop.disabled}
                      onChange={event => {
                        form.setFieldsValue({
                          [prop.name]: event.target.value
                        });
                      }}
                    />
                  )
                );
              })}
            </Form>
          )}
          <StyleSetLocalPath>
            <p>本地目录</p>
            <div className="input-area">
              <Input
                placeholder="输入或选择目录"
                allowClear
                value={projectRoot}
                onChange={e => {
                  // form.setFieldsValue({ projectRoot: e.target.value });
                  setProjectRoot(e.target.value);
                }}
              />
              <Button
                type="primary"
                icon={<FileAddOutlined />}
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
        handleCancel: () => {
          Modal.confirm({
            title: "提示",
            content: "填写的信息将不被保存，确定取消创建主题？",
            onOk: () => {
              closeModal();
              init();
            }
          });
        }
      },
      next: {
        disabled: isCreating || fieldsError.flatMap(o => o.errors).length > 0,
        async handleNext() {
          return form
            .validateFields()
            .then(nextStep)
            .catch(() => {
              message.warn("请填写正确表单");
            });
        }
      }
    },
    {
      name: "选择配置",
      Context: (
        <ResourceConfigManager
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
            message.warn("请选择配置模板");
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
          if (!projectRoot) throw new Error("请选择正确的本地路径");
          if (!fse.existsSync(projectRoot)) {
            await new Promise<void>(resolve => {
              Modal.confirm({
                title: "提示",
                content: `目录"${projectRoot}"不存在，是否创建？`,
                onOk: () => {
                  fse.ensureDirSync(projectRoot);
                  resolve();
                }
              });
            });
          } else if (fse.readdirSync(projectRoot).length > 0) {
            await new Promise<void>(resolve => {
              Modal.confirm({
                title: "提示",
                content: `目录"${projectRoot}"为非空目录，可能不是主题目录，是否仍然继续使用此目录？`,
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
          return apiCreateProject({
            root: projectRoot,
            description: projectInfoRef.current,
            scenarioMd5: currentScenario.md5,
            scenarioSrc: currentScenario.src,
            resourceSrc: resourceConfigPath
          })
            .then(data => {
              console.log("创建工程：", data);
              props.onProjectCreated(projectInfoRef.current);
            })
            .finally(() => {
              closeModal();
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
      <Button onClick={step.prev.handlePrev} disabled={step.prev.disabled}>
        上一步
      </Button>
    );
  };

  const NextButton = () => {
    if (!step.next) return null;
    return (
      <Button
        type="primary"
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
        onClick={() => {
          step.start
            .handleStart()
            .catch(err => message.error({ content: err.message }));
        }}
        disabled={step.start.disabled}
        loading={isCreating}
      >
        开始
      </Button>
    );
  };

  // 弹框底部控制按钮
  const modalFooter = [
    <CancelButton key="cancel" />,
    <PrevButton key="prev" />,
    <NextButton key="next" />,
    <StartButton key="start" />
  ];

  return (
    <div ref={r => (thisRef.current = r)}>
      <Button type="primary" onClick={handleStartCreate}>
        新建主题
      </Button>

      <StyleCreateModal
        width="700px"
        centered
        visible={modalVisible}
        title={`创建${currentScenario.name}`}
        destroyOnClose
        onCancel={closeModal}
        footer={modalFooter}
        forceRender
        maskClosable={false}
        getContainer={thisRef.current}
      >
        <StyleSteps steps={steps.map(o => o.name)} current={curStep} />
        {step.Context}
      </StyleCreateModal>
    </div>
  );
};

const StyleCreateModal = styled(Modal)`
  .ant-modal-body {
    display: flex;
    flex-direction: column;
    /* height: 450px; */
  }
`;

const StyleSteps = styled(Steps)`
  padding: 0 0 30px 0;
`;

const StyleSetLocalPath = styled.div`
  border-top: 0.5px ${({ theme }) => theme["@disabled-color"]} solid;
  padding-top: 20px;
  .input-area {
    display: flex;
  }
`;

const StyleFillInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

// const StyleProjectInfoForm = styled(ProjectInfoForm)`
//   width: 100%;
// `;

export default CreateProject;
