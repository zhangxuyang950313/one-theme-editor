import React from "react";
import styled from "styled-components";
import { Tooltip } from "antd";
import {
  IconDelete,
  IconPlus,
  IconLocation
} from "@arco-design/web-react/icon";

// 文件操作区
const FileHandler: React.FC<{
  locateVisible: boolean;
  exportVisible: boolean;
  deleteVisible: boolean;
  onLocate: () => void; // 追踪定位在界面的位置
  onImport: () => void; // 导入
  onDelete: () => void; // 删除
}> = props => {
  return (
    <StyleFileHandler>
      {props.locateVisible && (
        <Tooltip destroyTooltipOnHide overlay="定位" placement="right">
          <IconLocation className="press btn-normal" onClick={props.onLocate} />
        </Tooltip>
      )}
      {props.exportVisible && (
        <Tooltip destroyTooltipOnHide overlay="导入" placement="right">
          {/* 导入按钮 */}
          <IconPlus className="press btn-normal" onClick={props.onImport} />
        </Tooltip>
      )}
      {/* .9编辑按钮 */}
      {/* <FormOutlined className="press edit" onClick={() => {}} /> */}
      {/* 删除按钮 */}
      {props.deleteVisible && (
        <Tooltip destroyTooltipOnHide overlay="删除" placement="right">
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
    margin: 5px;
    font-size: 16px;
    &:hover {
      opacity: 0.8;
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
