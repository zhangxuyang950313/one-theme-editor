import { createStore, combineReducers } from "redux";

import BASE from "./modules/base/reducer";

const rootReducers = combineReducers({ BASE });

export default rootReducers;

export const interfaceStore = createStore(BASE);
