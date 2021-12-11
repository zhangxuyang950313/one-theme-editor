import React from "react";
import { Popover } from "@arco-design/web-react";
import { IconBranch, IconSync } from "@arco-design/web-react/icon";

import useDevices from "../../hooks/useDevices";

import { StyleIconItemArea } from "./style";

const Device: React.FC = () => {
  const { deviceList, fetching, fetchDeviceList } = useDevices();
  return (
    <>
      <Popover
        title="已连接设备"
        content={
          <div>
            {deviceList.map(item => (
              <div key={item.id}>MIX 2 ({item.id})</div>
            ))}
          </div>
        }
      >
        <StyleIconItemArea>
          <IconBranch className="icon" />
          <span className="content">已连接设备({deviceList.length})</span>
        </StyleIconItemArea>
      </Popover>
      <StyleIconItemArea title="同步设备信息" onClick={fetchDeviceList}>
        <IconSync className="icon" spin={fetching} />
      </StyleIconItemArea>
    </>
  );
};
export default Device;
