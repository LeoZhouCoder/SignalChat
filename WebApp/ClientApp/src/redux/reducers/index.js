import { combineReducers } from "redux";
import authReducer from "./auth";
import dimensionReducer from "./dimension";

export default combineReducers({ authReducer, dimensionReducer });
