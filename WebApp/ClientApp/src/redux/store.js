import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { TOKEN, USER } from "../redux/reducers/auth";

import Storage from "../utils/Storage";

export const store = createStore(rootReducer, applyMiddleware(thunk));

store.subscribe(() => {
  Storage.storeData(TOKEN, store.getState().authReducer[TOKEN]);
  Storage.storeData(USER, store.getState().authReducer[USER]);
});
