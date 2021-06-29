import fse from "fs-extra";
import React, { useEffect, useRef, useState } from "react";
import { v4 as UUID } from "uuid";
import { remote } from "electron";

import { isDev } from "@/core/constant";
import {
  useCurrentBrandConf,
  useSourceDescriptionList
} from "@/hooks/sourceConfig";
import { TypeProjectInfo } from "types/project";
import { TypeSourceDescription } from "types/source-config";
import { apiCreateProject } from "@/api";

// components
import styled from "styled-components";
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
  const brandConf = useCurrentBrandConf();
  // 弹框控制
  const [modalVisible, setModalVisible] = useState(false);
  // 模板列表
  const [sourceDescList, isLoading] = useSourceDescriptionList();
  // 选择的模板
  const [selectedSourceDesc, setSourceDesc] = useState<TypeSourceDescription>();
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

  if (!brandConf) {
    return null;
  }

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
    setSourceDesc(undefined);
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
    // {
    //   name: "选择版本",
    //   // 内容
    //   Component() {
    //     return (
    //       <SourceConfigManager
    //         isLoading={isLoading}
    //         sourceConfigList={sourceDescList}
    //         selectedSourceConfig={selectedSourceDesc}
    //         onSelected={setSourceDescription}
    //       />
    //     );
    //   },
    //   // 下一步
    //   next: {
    //     disabled: isCreating || !selectedSourceDesc,
    //     async handleNext() {
    //       if (selectedSourceDesc) nextStep();
    //       else message.warn({ content: "请选择版本" });
    //     }
    //   }
    // },
    {
      name: "主题信息",
      Component() {
        useEffect(() => {
          // if (!selectedSourceDesc) {
          //   message.info({ content: ERR_CODE[3002] });
          //   init();
          // }
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
        // 模板版本
        // if (!selectedSourceDesc) return null;
        return (
          <StyleFillInfo>
            {/* 模板预览 */}
            {/* <div className="template-card">
              <SourceConfigCard config={selectedSourceDesc} />
            </div> */}
            {/* 填写信息 */}
            <div className="project-info">
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
              <SourceConfigManager
                isLoading={isLoading}
                sourceConfigList={sourceDescList}
                selectedSourceConfig={selectedSourceDesc}
                onSelected={setSourceDesc}
              />
              <ProjectInfoForm form={form} initialValues={initialValues} />
            </div>
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
          if (!selectedSourceDesc) {
            throw new Error("未选择版本");
          }
          if (!projectInfo) {
            throw new Error("信息为空");
          }
          updateCreating(true);
          return apiCreateProject({
            projectRoot: projectRootRef.current || "",
            sourceNamespace: selectedSourceDesc.namespace,
            brandInfo: {
              name: brandConf.name,
              type: brandConf.type
            },
            projectInfo
          }).then(data => {
            console.log("创建工程：", data);
            if (!projectInfo) {
              throw new Error("工程信息为空");
            }
            props.onProjectCreated(projectInfo);
            closeModal();
            updateCreating(false);
            setTimeout(init, 300);
          });
        }
      }
    }
    // {
    //   name: "选择目录",
    //   Component() {
    //     useEffect(() => {
    //       onChange(path.join(remote.app.getPath("desktop"), "test"));
    //       if (!description) {
    //         message.info({ content: ERR_CODE[3001] });
    //       }
    //     }, []);
    //     const [projectRoot, setLocalPath] = useState<string>();
    //     const onChange = (val: string) => {
    //       localPathRef.current = val;
    //       setLocalPath(val);
    //     };
    //     if (!description) {
    //       return null;
    //     }
    //     const selectDir = () => {
    //       remote.dialog
    //         .showOpenDialog({
    //           // https://www.electronjs.org/docs/api/dialog#dialogshowopendialogsyncbrowserwindow-options
    //           title: "选择工程文件",
    //           properties: ["openDirectory", "createDirectory", "promptToCreate"]
    //         })
    //         .then(result => {
    //           if (result.canceled) return;
    //           onChange(result.filePaths[0]);
    //         });
    //     };
    //     return (
    //       <StyleConfirmInfo>
    //         <StyleSetLocalPath>
    //           <p>选择本地目录</p>
    //           <div className="input-area">
    //             <Input
    //               placeholder="输入或选择目录"
    //               allowClear
    //               value={projectRoot}
    //               onChange={e => onChange(e.target.value)}
    //             />
    //             <Button
    //               type="primary"
    //               icon={<FileAddOutlined />}
    //               onClick={selectDir}
    //             >
    //               选择
    //             </Button>
    //           </div>
    //         </StyleSetLocalPath>
    //         <br />
    //         <p>主题信息</p>
    //         <StyleFillInfo>
    //           <div className="template-card">
    //             <ProjectCard description={description} />
    //           </div>
    //           <div className="project-info">
    //             <ProjectInfo description={description} />
    //           </div>
    //         </StyleFillInfo>
    //       </StyleConfirmInfo>
    //     );
    //   },
    //   prev: {
    //     disabled: isCreating,
    //     handlePrev: prevStep
    //   },
    //   // 开始
    //   start: {
    //     disabled: isCreating,
    //     async handleStart() {
    //       const local = localPathRef.current;
    //       if (!local) throw new Error("请选择正确的本地路径");
    //       if (!fse.existsSync(local)) {
    //         await new Promise<void>(resolve => {
    //           Modal.confirm({
    //             title: "提示",
    //             content: `目录"${local}"不存在，是否创建？`,
    //             onOk: () => {
    //               fse.ensureDirSync(local);
    //               resolve();
    //             }
    //           });
    //         });
    //       } else if (fse.readdirSync(local).length > 0) {
    //         await new Promise<void>(resolve => {
    //           Modal.confirm({
    //             title: "提示",
    //             content: `目录"${local}"为非空目录，可能不是主题目录，是否仍然继续使用此目录？`,
    //             onOk: () => {
    //               resolve();
    //             }
    //           });
    //         });
    //       }
    //       if (!selectedSourceDesc) {
    //         throw new Error("创建失败");
    //       }
    //       updateCreating(true);
    //       // TODO 使用选择的模板路径生成 tempConf
    //       return apiCreateProject({
    //         description,
    //         brandConf,
    //         uiVersion: selectedSourceDesc.uiVersion,
    //         sourceDescription: selectedSourceDesc,
    //         projectRoot: localPathRef.current || ""
    //       }).then(data => {
    //         console.log("创建工程：", data);
    //         if (!description) {
    //           throw new Error("工程信息为空");
    //         }
    //         props.onProjectCreated(description);
    //         closeModal();
    //         updateCreating(false);
    //         setTimeout(init, 300);
    //       });
    //     }
    //   }
    // }
  ];

  // 创建主题步骤容器
  const StepContainer: React.FC = () => {
    return steps[curStep]?.Component() || null;
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
        <div className="step">
          <Steps steps={steps.map(o => o.name)} current={curStep} />
        </div>
        <br />
        <StyleStepContainer>
          <StepContainer />
        </StyleStepContainer>
      </Modal>
    </StyleCreateProject>
  );
};

const StyleCreateProject = styled.div`
  .step {
    padding: 0 50px;
  }
`;

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
  padding: 10px 0;
  .template-card {
    flex-shrink: 0;
    width: 200px;
  }
  .project-info {
    width: 100%;
    margin-left: 30px;
  }
`;

export default CreateProject;
