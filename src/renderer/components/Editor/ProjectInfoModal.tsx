import path from "path";
import fse from "fs-extra";
import React from "react";
import { Form, Modal, ModalProps } from "antd";
import {
  useProjectInfoConfig,
  useProjectInfo,
  useProjectRoot
} from "@/hooks/project/index";
import { TypeProjectInfo } from "src/types/project";
import TempStringUtil from "src/utils/TempStringUtil";
import ProjectInfoForm from "../ProjectInfoForm";
import { ProjectInput } from "../Forms";

const ProjectInfoModal: React.FC<ModalProps> = props => {
  const [form] = Form.useForm<TypeProjectInfo>();
  const projectInfo = useProjectInfo();
  const projectRoot = useProjectRoot();
  const projectInfoConfig = useProjectInfoConfig();
  return (
    <Modal
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
      <ProjectInfoForm form={form} preserve={false} initialValues={projectInfo}>
        {projectInfoConfig.items.map(item => {
          return (
            item.visible && (
              <ProjectInput
                key={item.name}
                name={item.name}
                label={item.description}
                disabled={item.disabled}
                onChange={event => {
                  form.setFieldsValue({ [item.name]: event.target.value });
                }}
              />
            )
          );
        })}
      </ProjectInfoForm>
    </Modal>
  );
};

export default ProjectInfoModal;
