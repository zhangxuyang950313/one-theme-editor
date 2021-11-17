import React from "react";
import styled from "styled-components";
import { Tooltip } from "antd";
import { IconDelete, IconEye, IconFile } from "@arco-design/web-react/icon";

// 文件操作区
const FileHandler: React.FC<{
  locateVisible: boolean;
  exportVisible: boolean;
  deleteVisible: boolean;
  onLocate: () => void; // 追踪定位在界面的位置
  onImport: () => void; // 导入
  onDelete: () => void; // 删除
  iconEyeFocus: boolean;
}> = props => {
  return (
    <StyleFileHandler>
      {props.locateVisible && (
        <Tooltip
          destroyTooltipOnHide
          overlay={props.iconEyeFocus ? "关闭高亮" : "高亮"}
          placement="right"
        >
          <IconEye
            className="press btn-normal focus"
            data-eye-focus={props.iconEyeFocus}
            onClick={props.onLocate}
          />
        </Tooltip>
      )}
      {props.exportVisible && (
        <Tooltip destroyTooltipOnHide overlay="选择" placement="right">
          {/* 导入按钮 */}
          <IconFile className="press btn-normal" onClick={props.onImport} />
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
  .focus {
    &[data-eye-focus="true"] {
      color: rgba(var(--primary-6));
    }
  }
  .press {
    cursor: pointer;
    margin: 5px;
    font-size: 18px;
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
