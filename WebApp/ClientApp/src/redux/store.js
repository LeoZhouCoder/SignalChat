import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { TOKEN, USER } from "../redux/reducers/auth";

import Storage from "../utils/Storage";

export const store = createStore(rootReducer, applyMiddleware(thunk));

store.subscribe(() => {
  const state = store.getState();
  console.log("[Redux]:", state);
  if (Storage.retrieveData(TOKEN) !== state.authReducer[TOKEN]) {
    Storage.storeData(TOKEN, state.authReducer[TOKEN]);
    Storage.storeData(USER, state.authReducer[USER]);
  }
});
