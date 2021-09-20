/**
 * 工具栏
 */
import React, { useRef, useState } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";

import {
  PlusOutlined,
  ExportOutlined,
  CloudUploadOutlined,
  InfoCircleOutlined,
  MobileOutlined,
  FolderOutlined
} from "@ant-design/icons";
import IconButton from "@/components/IconButton";
import { usePackProject } from "@/hooks/socket";
import ProjectInfoModal from "./ProjectInfoModal";

const icons = {
  apply: { name: "应用", icon: <MobileOutlined /> },
  save: { name: "保存", icon: <FolderOutlined /> },
  export: { name: "导出", icon: <ExportOutlined /> },
  upload: { name: "上传", icon: <CloudUploadOutlined /> },
  info: { name: "资料", icon: <InfoCircleOutlined /> },
  dark: { name: "深色", icon: <InfoCircleOutlined /> },
  light: { name: "浅色", icon: <InfoCircleOutlined /> },
  new: { name: "新建", icon: <PlusOutlined /> }
};

type TypeIconsType = keyof typeof icons;

export default function ToolsBar(): JSX.Element {
  const history = useHistory();
  const thisRef = useRef<HTMLDivElement | null>();
  const [projectInfoVisible, setProjectInfoVisible] = useState(false);
  const packProject = usePackProject();
  const handleClick = (key: TypeIconsType) => {
    switch (key) {
      case "apply": {
        break;
      }
      case "save": {
        packProject(
          {
            scenarioMd5: "2993f7d72871c927e60a3899ed9d565d",
            packDir: "/Users/zhangxuyang/Desktop/test",
            outputFile: "/Users/zhangxuyang/Desktop/test/test.zip"
          },
          d => {
            console.log(d);
          }
        );
        break;
      }
      case "new": {
        history.push("/");
        break;
      }
      case "export": {
        break;
      }
      case "upload": {
        break;
      }
      case "info": {
        setProjectInfoVisible(true);
        break;
      }
      case "dark": {
        break;
      }
      case "light": {
        break;
      }
    }
  };
  return (
    <StyleToolsBar ref={r => (thisRef.current = r)}>
      <div className="btn-group">
        {(Object.keys(icons) as TypeIconsType[]).map(key => {
          const item = icons[key];
          return (
            <div className="btn-item" key={item.name}>
              <IconButton text={item.name} onClick={() => handleClick(key)}>
                {item.icon}
              </IconButton>
            </div>
          );
        })}
      </div>
      <ProjectInfoModal
        title="修改主题信息"
        centered
        destroyOnClose
        getContainer={thisRef.current}
        visible={projectInfoVisible}
        onCancel={() => {
          setProjectInfoVisible(false);
        }}
      />
    </StyleToolsBar>
  );
}

const StyleToolsBar = styled.div`
  width: 100%;
  padding: 10px 10px 4px 10px;
  background: ${({ theme }) => theme["@background-color"]};
  display: flex;
  flex-shrink: 0;
  /* justify-content: space-between; */
  box-sizing: border-box;
  border-bottom: 1px solid;
  border-bottom-color: ${({ theme }) => theme["@border-color-base"]};
  .btn-group {
    display: flex;
    .btn-item {
      margin: 0 10px;
    }
  }
`;
