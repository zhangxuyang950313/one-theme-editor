import path from "path";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import _ from "lodash";
import * as uuid from "uuid";
import { remote } from "electron";
import fse from "fs-extra";

import { isDev } from "@/core/constant";
import ERR_CODE from "@/core/error-code";
import { useSelectedBrand, useTemplateList } from "@/hooks/template";
import { TypeProjectDescription } from "types/project";
import { TypeTemplateConf } from "types/template";
import { createProject } from "@/api";

// components
import { Modal, Button, message, Form, Input } from "antd";
import { FileAddOutlined } from "@ant-design/icons";
import Steps from "@/components/Steps";
import ProjectInfo from "@/components/ProjectInfo";
import ProjectInfoForm from "@/components/ProjectInfoForm";
import TemplateManager from "./TemplateManager";
import TemplateCard from "./TemplateCard";
import ProjectCard from "./ProjectCard";

// 创建主题按钮
type TypeProps = {
  onProjectCreated: (description: TypeProjectDescription) => Promise<void>;
};
const CreateProject: React.FC<TypeProps> = props => {
  // 机型配置
  const brandConf = useSelectedBrand();
  // 弹框控制
  const [modalVisible, setModalVisible] = useState(false);
  // 模板列表
  const [templateList, isLoading] = useTemplateList();
  // 选择的模板
  const [selectedTemp, updateTempConf] = useState<TypeTemplateConf>();
  // 当前步骤
  const [curStep, setCurStep] = useState(0);
  // 填写工程描述
  const [description, setDescription] = useState<TypeProjectDescription>();
  // 填写本地目录
  const localPathRef = useRef<string>();
  // 创建状态
  const [isCreating, updateCreating] = useState(false);
  // 表单实例
  const [form] = Form.useForm<TypeProjectDescription>();

  if (!brandConf) {
    return null;
  }

  // 表单默认值
  const initialValues = {
    name: isDev ? `测试${uuid.v4()}` : "",
    designer: isDev ? "测试" : "",
    author: isDev ? "测试" : "",
    version: "1.0.0",
    uiVersion: _.last(selectedTemp?.uiVersions)?.code || ""
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
    updateTempConf(undefined);
    setDescription(undefined);
    form.resetFields();
  };

  // 开始创建主题
  const handleCreateProject = () => {
    // init();
    openModal();
  };

  // 上一步
  const handlePrev = () => {
    if (curStep === 0) {
      handleCancel();
      return;
    }
    prevStep();
  };

  // 下一步
  const handleNext = () => {
    steps[curStep]
      .next()
      .then(nextStep)
      .catch(err => {
        if (typeof err.message === "string") {
          message.warn({ content: err.message });
        } else {
          message.warn({ content: "未知错误" });
        }
      });
  };

  // 主动关闭
  const handleCancel = () => {
    Modal.confirm({
      title: "提示",
      content: "填写的信息将不被保存，确定取消创建主题？",
      onOk: () => {
        closeModal();
        init();
      }
    });
  };

  const steps = [
    {
      name: "选择模板",
      Component() {
        return (
          <TemplateManager
            isLoading={isLoading}
            templateList={templateList}
            selectedTemp={selectedTemp}
            onSelected={updateTempConf}
          />
        );
      },
      // 校验表单
      async next() {
        return selectedTemp || Promise.reject(new Error("请选择模板"));
      }
    },
    {
      name: "填写信息",
      Component() {
        const uiVersions = selectedTemp?.uiVersions;
        useEffect(() => {
          if (!(Array.isArray(uiVersions) && uiVersions.length > 0)) {
            message.info({ content: ERR_CODE[3001] });
            init();
          } else if (!selectedTemp) {
            message.info({ content: ERR_CODE[3002] });
            init();
          }
        }, []);
        // 模板版本
        if (!selectedTemp) return null;
        return (
          <StyleFillInfo>
            {/* 模板预览 */}
            <div className="template-card">
              <TemplateCard config={selectedTemp} />
            </div>
            {/* 填写信息 */}
            <div className="project-info">
              <ProjectInfoForm
                uiVersions={uiVersions || []}
                form={form}
                initialValues={initialValues}
              />
            </div>
          </StyleFillInfo>
        );
      },
      async next() {
        return form
          .validateFields()
          .then(setDescription)
          .catch(() => {
            throw new Error("请填写正确表单");
          });
      }
    },
    {
      name: "选择目录",
      Component() {
        useEffect(() => {
          onChange(path.join(remote.app.getPath("desktop"), "test"));
          if (!description) {
            message.info({ content: ERR_CODE[3001] });
          }
        }, []);
        const [localPath, setLocalPath] = useState<string>();
        const onChange = (val: string) => {
          localPathRef.current = val;
          setLocalPath(val);
        };
        if (!description) {
          return null;
        }
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
          <StyleConfirmInfo>
            <StyleSetLocalPath>
              <p>选择本地目录</p>
              <div className="input-area">
                <Input
                  placeholder="输入或选择目录"
                  allowClear
                  value={localPath}
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
            <br />
            <p>主题信息</p>
            <StyleFillInfo>
              <div className="template-card">
                <ProjectCard description={description} />
              </div>
              <div className="project-info">
                <ProjectInfo description={description} />
              </div>
            </StyleFillInfo>
          </StyleConfirmInfo>
        );
      },
      async next() {
        const local = localPathRef.current;
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
              onOk: resolve
            });
          });
        }
        if (!selectedTemp) {
          throw new Error("创建失败");
        }
        const uiVersion = selectedTemp.uiVersions.find(
          o => o.code === form.getFieldValue("uiVersion")
        );
        if (!uiVersion) {
          throw new Error(ERR_CODE[2002]);
        }
        updateCreating(true);
        // TODO 使用选择的模板路径生成 tempConf
        return createProject({
          description,
          brandConf,
          uiVersionConf: uiVersion,
          templateConf: selectedTemp,
          localPath: localPathRef.current
        }).then(data => {
          console.log("创建工程：", data);
          if (!description) {
            throw new Error("工程信息为空");
          }
          props.onProjectCreated(description);
          closeModal();
          updateCreating(false);
          setTimeout(init, 300);
        });
      }
    }
  ];

  // 创建主题步骤容器
  const StepContainer: React.FC = () => {
    return steps[curStep]?.Component() || null;
  };

  // 弹框底部控制按钮
  const modalFooter = [
    <Button
      key="prev"
      onClick={curStep > 0 ? handlePrev : handleCancel}
      disabled={isCreating}
    >
      {curStep > 0 ? "上一步" : "取消"}
    </Button>,
    <Button
      key="next"
      type="primary"
      onClick={handleNext}
      disabled={!selectedTemp || isCreating}
      loading={isCreating}
    >
      {curStep < steps.length - 1 ? "下一步" : "开始"}
    </Button>
  ];

  return (
    <StyleCreateProject>
      <Button type="primary" onClick={handleCreateProject}>
        新建主题
      </Button>
      <Modal
        width="700px"
        visible={modalVisible}
        title={`创建${brandConf.name}主题`}
        destroyOnClose={true}
        onCancel={closeModal}
        footer={modalFooter}
      >
        <Steps steps={steps.map(o => o.name)} current={curStep} />
        <br />
        <StyleStepContainer>
          <StepContainer />
        </StyleStepContainer>
      </Modal>
    </StyleCreateProject>
  );
};

const StyleCreateProject = styled.div``;

const StyleSetLocalPath = styled.div`
  .input-area {
    display: flex;
  }
`;

const StyleStepContainer = styled.div`
  height: 50vh;
  overflow: auto;
`;

const StyleFillInfo = styled.div`
  display: flex;
  padding: 10px;
  .template-card {
    flex-shrink: 0;
    width: 200px;
  }
  .project-info {
    width: 100%;
    margin-left: 30px;
  }
`;

const StyleConfirmInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export default CreateProject;
