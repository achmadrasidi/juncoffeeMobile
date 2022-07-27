import {
  ADD_USER_INFO,
  REMOVE_USER_INFO,
  UPDATE_USER_INFO,
} from "../constant/userConstant";

export const userInfoReducer = (state = {info: {}}, action) => {
  switch (action.type) {
    case ADD_USER_INFO:
      return {
        ...state,
        info: action.payload,
        isLoggedIn: true,
      };
    case UPDATE_USER_INFO:
      return {
        ...state,
        info: {...state.info, ...action.payload},
        isLoggedIn: true,
      };

    case REMOVE_USER_INFO:
      return {
        ...state,
        info: action.payload,
        isLoggedIn: false,
      };
    default:
      return state;
  }
};
