import path from "path";
import fse from "fs-extra";
import React from "react";
import styled from "styled-components";
import { Form, Modal, ModalProps } from "antd";
import {
  useProjectInfoConfig,
  useProjectInfo,
  useProjectRoot
} from "@/hooks/project/index";
import { TypeProjectInfo } from "src/types/project";
import TempStringUtil from "src/utils/TempStringUtil";
import ProjectInfoForm from "../ProjectInfoForm";

const ProjectInfoModal: React.FC<ModalProps> = props => {
  const [form] = Form.useForm<TypeProjectInfo>();
  const projectInfo = useProjectInfo();
  const projectRoot = useProjectRoot();
  const projectInfoConfig = useProjectInfoConfig();
  return (
    <StyleProjectInfoModal
      {...props}
      onOk={async e => {
        const data = form.getFieldsValue();
        // TODO 写入 projectInfoConfig.content
        const replaced = TempStringUtil.replace(
          projectInfoConfig.template,
          data
        );
        console.log({
          projectInfoConfig,
          projectInfo: data,
          replaced
        });
        console.log(replaced);

        await fse.writeFile(
          path.join(projectRoot, projectInfoConfig.output),
          replaced,
          "utf8"
        );
        if (props.onOk) {
          props.onOk(e);
        }
      }}
    >
      <ProjectInfoForm
        form={form}
        preserve={false}
        initialValues={projectInfo}
        projectInfoConfig={projectInfoConfig}
      />
    </StyleProjectInfoModal>
  );
};

const StyleProjectInfoModal = styled(Modal)``;

export default ProjectInfoModal;
