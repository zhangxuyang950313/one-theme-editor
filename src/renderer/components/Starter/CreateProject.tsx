import path from "path";
import fse from "fs-extra";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { v4 as UUID } from "uuid";
import { remote } from "electron";

import { isDev } from "@/core/constant";
import { apiCreateProject } from "@/request";
import { useBrandConf, useSourceDescriptionList } from "@/hooks/source";
import { TypeProjectInfo } from "types/project";
import { TypeSourceConfigInfo } from "types/source";

import { Modal, Button, Form, Input, message } from "antd";
import { FileAddOutlined } from "@ant-design/icons";
import Steps from "@/components/Steps";
import ProjectInfoForm from "@/components/ProjectInfoForm";
import SourceConfigManager from "./SourceConfigManager";

// 创建主题按钮
type TypeProps = {
  onProjectCreated: (projectInfo: TypeProjectInfo) => Promise<void>;
};
const CreateProject: React.FC<TypeProps> = props => {
  // 机型配置
  const [brandConf] = useBrandConf();
  // 弹框控制
  const [modalVisible, setModalVisible] = useState(false);
  // 模板列表
  const [sourceDescList, isLoading] = useSourceDescriptionList();
  // 选择的模板
  const [sourceConfig, setSourceConfig] = useState<TypeSourceConfigInfo>();
  // 当前步骤
  const [curStep, setCurStep] = useState(0);
  // 填写工程描述
  const [projectInfo, setProjectInfo] = useState<TypeProjectInfo>();
  // 填写本地目录
  const projectRootRef = useRef<string>();
  // 创建状态
  const [isCreating, updateCreating] = useState(false);
  // 表单实例
  const [form] = Form.useForm<TypeProjectInfo>();

  if (!brandConf) return null;

  // 表单默认值
  const initialValues = {
    name: isDev ? `测试${UUID()}` : "",
    designer: isDev ? "测试" : "",
    author: isDev ? "测试" : "",
    version: "1.0.0",
    uiVersion: "10"
  };

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
    setSourceConfig(undefined);
    setProjectInfo(undefined);
    form.resetFields();
  };

  // 开始创建主题
  const handleStartCreate = () => {
    // init();
    openModal();
  };

  // 每一步配置
  const steps = [
    {
      name: "主题信息",
      Component() {
        useEffect(() => {
          // onChange(path.join(remote.app.getPath("desktop"), "test"));
          onChange("/Users/zhangxuyang/mine/theme-test");
        }, []);
        const [projectRoot, setLocalPath] = useState<string>();
        const onChange = (val: string) => {
          projectRootRef.current = val;
          setLocalPath(val);
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
              onChange(result.filePaths[0]);
            });
        };
        return (
          <StyleFillInfo>
            {/* 填写信息 */}
            <ProjectInfoForm
              className="project-info-form"
              form={form}
              initialValues={initialValues}
            />
            <StyleSetLocalPath>
              <p>选择本地目录</p>
              <div className="input-area">
                <Input
                  placeholder="输入或选择目录"
                  allowClear
                  value={projectRoot}
                  onChange={e => onChange(e.target.value)}
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
        );
      },
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
        disabled: isCreating,
        async handleNext() {
          return form
            .validateFields()
            .then(setProjectInfo)
            .then(nextStep)
            .catch(() => {
              throw new Error("请填写正确表单");
            });
        }
      }
    },
    {
      name: "选择配置",
      Component() {
        return (
          <SourceConfigManager
            isLoading={isLoading}
            sourceConfigList={sourceDescList}
            selectedConfig={sourceConfig}
            onSelected={setSourceConfig}
          />
        );
      },
      prev: {
        disabled: isCreating,
        handlePrev: prevStep
      },
      next: {
        disabled: isCreating,
        async handleNext() {
          return form
            .validateFields()
            .then(setProjectInfo)
            .then(nextStep)
            .catch(() => {
              throw new Error("请填写正确表单");
            });
        }
      }
    },
    {
      name: "选择模板",
      Component() {
        return null;
      },
      prev: {
        disabled: isCreating,
        handlePrev: prevStep
      },
      // 开始
      start: {
        disabled: isCreating,
        async handleStart() {
          const local = projectRootRef.current;
          if (!local) throw new Error("请选择正确的本地路径");
          if (!fse.existsSync(local)) {
            await new Promise<void>(resolve => {
              Modal.confirm({
                title: "提示",
                content: `目录"${local}"不存在，是否创建？`,
                onOk: () => {
                  fse.ensureDirSync(local);
                  resolve();
                }
              });
            });
          } else if (fse.readdirSync(local).length > 0) {
            await new Promise<void>(resolve => {
              Modal.confirm({
                title: "提示",
                content: `目录"${local}"为非空目录，可能不是主题目录，是否仍然继续使用此目录？`,
                onOk: () => {
                  resolve();
                }
              });
            });
          }
          if (!sourceConfig) {
            throw new Error("未选择版本");
          }
          if (!projectInfo) {
            throw new Error("信息为空");
          }
          updateCreating(true);
          return apiCreateProject({
            projectRoot: projectRootRef.current || "",
            sourceConfigPath: path.join(sourceConfig.root, sourceConfig.config),
            brandInfo: {
              name: brandConf.name,
              md5: brandConf.md5
            },
            projectInfo
          })
            .then(data => {
              console.log("创建工程：", data);
              if (!projectInfo) {
                throw new Error("工程信息为空");
              }
              props.onProjectCreated(projectInfo);
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

  // 创建主题步骤容器
  const StepContainer: React.FC<{ className?: string }> = props => {
    return (
      <div className={props.className}>
        {steps[curStep].Component() || null}
      </div>
    );
  };

  const CancelButton = () => {
    const step = steps[curStep];
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
    const step = steps[curStep];
    if (!step.prev) return null;
    return (
      <Button onClick={step.prev.handlePrev} disabled={step.prev.disabled}>
        上一步
      </Button>
    );
  };

  const NextButton = () => {
    const step = steps[curStep];
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
    const step = steps[curStep];
    if (!step.start) return null;
    return (
      <Button
        type="primary"
        onClick={() =>
          step.start
            .handleStart()
            .catch(err => message.error({ content: err.message }))
        }
        disabled={step.start?.disabled}
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
    <StyleCreateProject>
      <Button type="primary" onClick={handleStartCreate}>
        新建主题
      </Button>
      <Modal
        width="700px"
        visible={modalVisible}
        title={`创建${brandConf.name}`}
        destroyOnClose={true}
        onCancel={closeModal}
        footer={modalFooter}
      >
        <Steps
          className="step"
          steps={steps.map(o => o.name)}
          current={curStep}
        />
        <StepContainer className="step-container" />
      </Modal>
    </StyleCreateProject>
  );
};

const StyleCreateProject = styled.div`
  .step {
    padding: 0 50px 50px 50px;
  }
  .step-container {
    height: 50vh;
  }
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
  margin: 40px 0 20px 0;
  .project-info-form {
    width: 100%;
  }
`;

export default CreateProject;
