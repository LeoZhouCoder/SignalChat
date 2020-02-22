import { WINDOW_RESIZE } from "../actionTypes";
import { getScreenType } from "../../utils/Dimensions";

export default function dimensionReducer(state = getScreenType(), action) {
  switch (action.type) {
    case WINDOW_RESIZE:
      console.log("[DimensionReducer]:", action);
      return action.payload;
    default:
      return state;
  }
}
