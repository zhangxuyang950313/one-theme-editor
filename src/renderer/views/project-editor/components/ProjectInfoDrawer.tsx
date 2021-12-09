import React from "react";
import { useRecoilValue } from "recoil";
import { Drawer, DrawerProps } from "@arco-design/web-react";

import { FILE_TEMPLATE_TYPE } from "src/common/enums";

import { projectDataState } from "../store/rescoil/state";

import ProjectForm from "@/components/ProjectForm";

const ProjectInfoDrawer: React.FC<{ drawerProps: DrawerProps }> = props => {
  const { projectData, scenarioConfig } = useRecoilValue(projectDataState);
  // 工程信息配置
  const projectInfoConfig = scenarioConfig.fileTempList.find(
    item => item.type === FILE_TEMPLATE_TYPE.INFO
  );
  return (
    <Drawer width="50%" title="编辑信息" unmountOnExit {...props.drawerProps}>
      {projectInfoConfig && (
        <ProjectForm
          projectInfoConfig={projectInfoConfig}
          initialValues={projectData.description}
          // onLocalPathSuggestion={setLocalPath}
          onFormValuesChange={fieldsValue => {
            // form.setFieldsValue(fieldsValue);
            // Object.assign(projectInfoRef.current, fieldsValue);
          }}
        />
      )}
    </Drawer>
  );
};

export default ProjectInfoDrawer;
