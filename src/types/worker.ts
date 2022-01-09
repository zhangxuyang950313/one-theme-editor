import WORKER_TYPES from "src/common/enums/worker-types";

export type TypeMsgData<T extends WORKER_TYPES> = {
  id: number;
  uuid?: `${T}_${string}`;
  files: string[];
};

export type TypeResponseMsg<T extends WORKER_TYPES> = {
  id: number;
  // uuid: `${T}_${string}`;
  type: T;
};
