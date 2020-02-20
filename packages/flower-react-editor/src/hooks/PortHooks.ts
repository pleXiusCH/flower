import { Ctl, useController } from "../controller/ControllerContext";
import ConnectionsController, { PortStatus } from "../controller/ConnectionsController";
import { useObservable } from "react-use";
import { IPortDescriptor } from "@plexius/flower-interfaces/src";
import { useEffect } from "react";

export function usePortStatus(portDescriptor: IPortDescriptor) {
  const controller = useController(Ctl.Connections) as ConnectionsController;
  const portStatus = useObservable<PortStatus>(controller.getPortStatus$(portDescriptor));
  return portStatus;
}