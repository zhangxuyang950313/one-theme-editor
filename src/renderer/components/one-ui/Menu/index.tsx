import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Context from "./Context";

const Menu: React.FC<
  React.HTMLAttributes<HTMLLIElement> & {
    defaultKey: string;
    onChange?: (key: string) => void;
  }
> = props => {
  const [key, setKey] = useState("");
  useEffect(() => {
    props.onChange && props.onChange(key);
  }, [key]);
  return (
    <Context.Provider value={{ currentKey: key || props.defaultKey, setKey }}>
      <StyleMenu className={props.className}>{props.children}</StyleMenu>
    </Context.Provider>
  );
};
const StyleMenu = styled.li`
  display: flex;
  flex-direction: column;
`;

export default Menu;
