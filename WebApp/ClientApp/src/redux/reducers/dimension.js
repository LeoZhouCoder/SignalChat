import { WINDOW_RESIZE } from "../actionTypes";
import { getDimensions } from "../actions";

export const WIDTH = "width";
export const HEIGHT = "height";
export const TYPE = "type";

export default function dimensionReducer(state = getDimensions(), action) {
  switch (action.type) {
    case WINDOW_RESIZE:
      return action.payload;
    default:
      return state;
  }
}
