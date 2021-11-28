import React, { ReactNode, useRef } from "react";
import styled from "styled-components";
import { Tooltip } from "antd";
import {
  IconDelete,
  IconInfoCircle,
  IconFindReplace,
  IconSearch,
  IconBgColors,
  IconEdit
} from "@arco-design/web-react/icon";

// 文件操作区
const FileHandler: React.FC<{
  fileInfoNode: ReactNode;
  fileInfoVisible: boolean;
  exportVisible: boolean;
  jumpVisible: boolean;
  deleteVisible: boolean;
  onImportClick: () => void;
  onJumpClick: () => void;
  onDeleteClick: () => void;
}> = props => {
  const fileFilterRef = useRef<HTMLDivElement>(null);

  const getPopupContainer = () => fileFilterRef.current || document.body;

  return (
    <StyleFileHandler ref={fileFilterRef}>
      {props.fileInfoVisible && (
        <Tooltip
          placement="top"
          overlay={props.fileInfoNode}
          getPopupContainer={getPopupContainer}
          overlayStyle={{ maxWidth: "none" }}
        >
          {/* 查看信息按钮 */}
          <span className="press btn-normal btn-info">
            <IconInfoCircle className="icon" data-btn-info />
            <IconSearch
              className="icon"
              data-btn-jump
              onClick={props.onJumpClick}
            />
          </span>
        </Tooltip>
      )}
      {props.exportVisible && (
        <Tooltip overlay="选择文件" placement="right">
          {/* 导入按钮 */}
          <IconFindReplace
            className="press btn-normal"
            onClick={props.onImportClick}
          />
        </Tooltip>
      )}
      {/* .9编辑按钮 */}
      <Tooltip overlay="编辑" placement="right">
        <IconEdit className="press btn-normal btn-disabled" />
      </Tooltip>
      <Tooltip overlay="染色" placement="right">
        {/* 导入按钮 */}
        <IconBgColors className="press btn-normal btn-disabled" />
      </Tooltip>
      {/* 删除按钮 */}
      {props.deleteVisible && (
        <Tooltip overlay="移除" placement="right">
          <IconDelete
            className="press btn-delete"
            onClick={props.onDeleteClick}
          />
        </Tooltip>
      )}
    </StyleFileHandler>
  );
};

const StyleFileHandler = styled.div`
  --width: 26px;

  display: flex;
  flex-direction: column;
  width: var(--width);
  margin: 0 4px 4px;
  .press {
    cursor: pointer;
    width: 100%;
    height: auto;
    padding: 4px;
    font-size: 18px;
    line-height: 0;
    &:hover {
      border-radius: 50%;
      overflow: hidden;
      background-color: var(--color-text-4);
    }
    &:active {
      opacity: 0.5;
    }
    &.btn-info {
      position: relative;
      width: 100%;
      height: var(--width);
      .icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition: 0.1s all ease-out;
      }
      [data-btn-info] {
        opacity: 1;
      }
      [data-btn-jump] {
        opacity: 0;
      }
      &:hover {
        [data-btn-info] {
          opacity: 0;
        }
        [data-btn-jump] {
          opacity: 1;
        }
      }
    }
  }
  .btn-disabled {
    color: var(--color-border-3) !important;
  }
  .btn-normal {
    color: var(--color-text-2);
  }
  .btn-delete {
    color: red;
  }
`;

export default FileHandler;
