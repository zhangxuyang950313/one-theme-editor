import { useEffect, useState } from "react";
import { useTimeout, useToggle } from "ahooks";
import { Device } from "@devicefarmer/adbkit";
import { message } from "antd";

export default function useDevices(): {
  fetchDeviceList: () => Promise<Device[]>;
  fetching: boolean;
  deviceList: Device[];
} {
  const [deviceList, setDeviceList] = useState<Device[]>([]);
  const [fetching, setFetching] = useToggle();
  useTimeout(setFetching.setLeft, fetching ? 500 : 0);

  useEffect(() => {
    fetchDeviceList();
  }, []);

  const fetchDeviceList = async () => {
    setFetching.setRight();
    try {
      const list = await window.$one.$server.getDeviceList();
      setDeviceList(list);
      return list;
    } catch (err: any) {
      message.error(err.message);
      return [];
    }
  };

  return {
    fetchDeviceList,
    fetching,
    deviceList
  };
}
