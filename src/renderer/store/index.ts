import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import rootReducers from "./reducers";

export { rootReducers };

const composeEnhancers = composeWithDevTools();

const store = createStore(rootReducers, composeEnhancers);

const state = store.getState();

export type TypeStoreState = typeof state;

export default store;

export * as selectors from "./selectors";

export * as reducers from "./reducers";
