import { useEffect, useState } from "react";
import { useTimeout, useToggle } from "ahooks";
import { Device } from "@devicefarmer/adbkit";

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
    const list = await window.$one.$server.getDeviceList();
    setDeviceList(list);
    return list;
  };

  return {
    fetchDeviceList,
    fetching,
    deviceList
  };
}
