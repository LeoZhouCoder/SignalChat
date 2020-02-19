import { combineReducers } from "redux";
import authReducer from "./auth";
import dimensionReducer from "./dimension";
import chatReducer from "./chat";

export default combineReducers({ authReducer, dimensionReducer,chatReducer });
