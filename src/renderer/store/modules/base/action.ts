import ACTION_TYPES from "@/store/actions";

type TypeUpdateWindowTitle = {
  type: typeof ACTION_TYPES.SET_WINDOW_TITLE;
  title: string;
};

export type TypeActions = TypeUpdateWindowTitle;

export function ActionSetWindowTitle(title: string): TypeUpdateWindowTitle {
  return { type: ACTION_TYPES.SET_WINDOW_TITLE, title };
}
