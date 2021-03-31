import { UPDATE_WINDOW_TITLE } from "@/store/actions";

type TypeUpdateWindowTitle = {
  type: typeof UPDATE_WINDOW_TITLE;
  title: string;
};

type TypeActions = TypeUpdateWindowTitle;

const BaseState = {
  windowTitle: document.title
};

export type TypeBaseState = typeof BaseState;

export default function Base(
  state: TypeBaseState = BaseState,
  action: TypeActions
): TypeBaseState {
  switch (action.type) {
    case UPDATE_WINDOW_TITLE: {
      document.title = action.title;
      return { ...state, windowTitle: action.title };
    }
    default:
      return state;
  }
}
