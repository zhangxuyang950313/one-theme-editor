import React from "react";
import styled from "styled-components";
import { Tooltip } from "antd";
import { IconDelete, IconPlus, IconFile } from "@arco-design/web-react/icon";

// 文件操作区
const FileHandler: React.FC<{
  locateVisible: boolean;
  exportVisible: boolean;
  deleteVisible: boolean;
  onLocate: () => void;
  onImport: () => void;
  onDelete: () => void;
}> = props => {
  return (
    <StyleFileHandler>
      {props.exportVisible && (
        <Tooltip destroyTooltipOnHide overlay="选择文件" placement="right">
          {/* 导入按钮 */}
          <IconPlus className="press btn-normal" onClick={props.onImport} />
        </Tooltip>
      )}
      {props.locateVisible && (
        <Tooltip destroyTooltipOnHide overlay="查看文件" placement="right">
          <IconFile
            className="press btn-normal focus"
            onClick={props.onLocate}
          />
        </Tooltip>
      )}
      {/* .9编辑按钮 */}
      {/* <FormOutlined className="press edit" onClick={() => {}} /> */}
      {/* 删除按钮 */}
      {props.deleteVisible && (
        <Tooltip destroyTooltipOnHide overlay="移除" placement="right">
          <IconDelete className="press btn-delete" onClick={props.onDelete} />
        </Tooltip>
      )}
    </StyleFileHandler>
  );
};

const StyleFileHandler = styled.div`
  display: flex;
  flex-direction: column;
  width: 26px;
  .press {
    cursor: pointer;
    width: 100%;
    height: auto;
    padding: 4px;
    font-size: 18px;
    &:hover {
      border-radius: 50%;
      overflow: hidden;
      background-color: var(--color-text-4);
    }
    &:active {
      opacity: 0.5;
    }
  }
  .btn-normal {
    color: var(--color-text-2);
  }
  .btn-delete {
    color: red;
  }
`;

export default FileHandler;
