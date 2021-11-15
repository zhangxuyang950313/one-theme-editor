import React from "react";
import { IconClose, IconLocation } from "@arco-design/web-react/icon";
import styled from "styled-components";

const ValueHandler: React.FC<{
  locateVisible?: boolean;
  deleteVisible?: boolean;
  onLocate?: () => void;
  onDelete?: () => void;
}> = props => {
  const { locateVisible, deleteVisible, onLocate, onDelete } = props;
  return (
    <StyleValueHandler>
      {locateVisible && (
        <IconLocation className="btn locate" onClick={onLocate} />
      )}
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
