import React from "react";
import { IconClose, IconEye } from "@arco-design/web-react/icon";
import styled from "styled-components";

const ValueHandler: React.FC<{
  locateVisible?: boolean;
  deleteVisible?: boolean;
  onLocate?: () => void;
  onDelete?: () => void;
  iconEyeFocus: boolean;
}> = props => {
  const { locateVisible, deleteVisible, onLocate, onDelete, iconEyeFocus } = props;
  return (
    <StyleValueHandler>
      {locateVisible && <IconEye className="btn locate focus" data-eye-focus={iconEyeFocus} onClick={onLocate} />}
      {/* 删除 */}
      {deleteVisible && <IconClose className="btn delete" onClick={onDelete} />}
    </StyleValueHandler>
  );
};

const StyleValueHandler = styled.div`
  display: flex;
  align-items: center;
  padding-left: 20px;
  border-left: 1px solid;
  border-left-color: var(--color-secondary-disabled);
  .focus {
    &[data-eye-focus="true"] {
      color: rgba(var(--primary-6));
    }
  }
  .btn {
    cursor: pointer;
    font-size: 16px;
    &:not(:last-child) {
      margin-right: 10px;
    }
    &:hover {
      opacity: 0.6;
    }
  }
  .locate {
    color: var(--color-text-2);
  }
  .delete {
    color: red;
  }
`;

export default ValueHandler;
