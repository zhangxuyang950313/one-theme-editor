/**
 * 工具栏
 */
import React, { useEffect } from "react";
import styled from "styled-components";
import { TOOLS_BAR_BUTTON } from "src/common/enums";

import {
  IconExport,
  IconEye,
  IconEyeInvisible,
  IconFile,
  IconInfoCircle,
  IconMindMapping,
  IconMobile
} from "@arco-design/web-react/icon";

import { useToggle } from "ahooks";
import { useRecoilState } from "recoil";

import { panelToggleState } from "../store/rescoil/state";

import IconButton from "@/components/one-ui/IconButton";

// const ButtonGroup: React.FC<{ buttonList: TypeIconButtonOption[] }> = props => {
//   return (
//     <StyleButtonGroup>
//       {props.buttonList.map((button, key) => (
//         <div className="item" key={key}>
//           {button.name !== TOOLS_BAR_BUTTON.PLACEHOLDER && (
//             <IconButton {...button}>{button.icon}</IconButton>
//           )}
//         </div>
//       ))}
//     </StyleButtonGroup>
//   );
// };

// const StyleButtonGroup = styled.div`
//   display: flex;
//   .item {
//     -webkit-app-region: none;
//     width: 50px;
//     margin: 0 10px;
//   }
// `;

const ToolsBar: React.FC = props => {
  // useEffect(() => {
  //   setRightButtons([
  //     {
  //       name: TOOLS_BAR_BUTTON.APPLY,
  //       icon: <IconMobile />
  //     },
  //     // {
  //     //   name: TOOLS_BAR_BUTTON.SAVE,
  //     //   icon: <FolderOutlined />
  //     // },
  //     {
  //       name: TOOLS_BAR_BUTTON.EXPORT,
  //       icon: <IconExport />,
  //       onClick: () => {
  //         const { root, description } = projectData;
  //         const { extname } = scenarioConfig.packageConfig;
  //         const defaultPath = path.join(
  //           path.dirname(projectData.root),
  //           `${description.name}.${extname}`
  //         );
  //         remote.dialog
  //           // https://www.electronjs.org/docs/api/dialog#dialogshowopendialogsyncbrowserwindow-options
  //           .showSaveDialog({
  //             properties: ["createDirectory"],
  //             defaultPath,
  //             filters: [{ name: extname, extensions: [extname] }]
  //           })
  //           .then(result => {
  //             if (result.canceled) return;
  //             if (!result.filePath) {
  //               Message.info("未指定任何文件");
  //               return;
  //             }
  //             window.$one.$server.packProject(
  //               {
  //                 packDir: root,
  //                 outputFile: result.filePath,
  //                 packConfig: scenarioConfig.packageConfig
  //               },
  //               data => {
  //                 console.log(data);
  //               }
  //             );
  //           });
  //       }
  //     },
  //     {
  //       name: TOOLS_BAR_BUTTON.INFO,
  //       icon: <IconInfoCircle />,
  //       onClick: () => {
  //         toggleProjectInfo.setRight();
  //       }
  //     }
  //   ]);
  // }, [projectData, scenarioConfig]);

  const [panelToggle, setPanelToggle] = useRecoilState(panelToggleState);

  const toggleModuleSelector = () => {
    setPanelToggle(state => ({
      ...state,
      moduleSelector: !state.moduleSelector
    }));
  };

  const togglePageSelector = () => {
    setPanelToggle(state => ({
      ...state,
      pageSelector: !state.pageSelector
    }));
  };
  const togglePagePreview = () => {
    setPanelToggle(state => ({
      ...state,
      pagePreview: !state.pagePreview
    }));
  };

  return (
    <StyleToolsBar>
      <div className="btn-group">
        <IconButton
          className="item"
          name={TOOLS_BAR_BUTTON.MODULE_TOGGLE}
          icon={<IconMindMapping />}
          toggle={panelToggle.moduleSelector}
          onClick={toggleModuleSelector}
        />
        <IconButton
          className="item"
          name={TOOLS_BAR_BUTTON.PAGE_TOGGLE}
          icon={<IconFile />}
          toggle={panelToggle.pageSelector}
          onClick={togglePageSelector}
        />
        <IconButton
          className="item"
          name={TOOLS_BAR_BUTTON.PREVIEW_TOGGLE}
          icon={panelToggle.pagePreview ? <IconEye /> : <IconEyeInvisible />}
          toggle={panelToggle.pagePreview}
          onClick={togglePagePreview}
        />
      </div>
      <div className="btn-group">
        <IconButton
          className="item"
          name={TOOLS_BAR_BUTTON.APPLY}
          icon={<IconMobile />}
          onClick={toggleModuleSelector}
        />
        <IconButton
          className="item"
          name={TOOLS_BAR_BUTTON.EXPORT}
          icon={<IconExport />}
          onClick={toggleModuleSelector}
        />
        <IconButton
          className="item"
          name={TOOLS_BAR_BUTTON.INFO}
          icon={<IconInfoCircle />}
          onClick={toggleModuleSelector}
        />
      </div>
    </StyleToolsBar>
  );
};

const StyleToolsBar = styled.div`
  width: 100%;
  padding: 15px 10px 10px 10px;
  display: flex;
  justify-content: space-between;
  flex-shrink: 0;
  box-sizing: border-box;
  -webkit-app-region: drag;
  .btn-group {
    width: 100%;
    display: flex;
    .item {
      -webkit-app-region: none;
      width: 50px;
      margin: 0 10px;
    }
  }
`;
export default ToolsBar;
