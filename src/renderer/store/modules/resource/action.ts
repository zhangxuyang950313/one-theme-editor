import ACTION_TYPES from "@/store/actions";

import { TypeResourceImage } from "types/project";

type TypeActionAddResourceImage = {
  type: typeof ACTION_TYPES.ADD_RESOURCE;
  payload: TypeResourceImage;
};

type TypeActionDelResourceImage = {
  type: typeof ACTION_TYPES.DEL_RESOURCE;
  payload: TypeResourceImage;
};

export type TypeActions =
  | TypeActionAddResourceImage
  | TypeActionDelResourceImage;

export function addResourceImage(
  payload: TypeResourceImage
): TypeActionAddResourceImage {
  return { type: ACTION_TYPES.ADD_RESOURCE, payload };
}

export function delResourceImage(
  payload: TypeResourceImage
): TypeActionDelResourceImage {
  return { type: ACTION_TYPES.DEL_RESOURCE, payload };
}
