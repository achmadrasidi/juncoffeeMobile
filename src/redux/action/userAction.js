import {
  ADD_USER_INFO,
  REMOVE_USER_INFO,
  UPDATE_USER_INFO,
} from "../constant/userConstant";

export const userLogin =
  ({id, email, token, image, address, phone_number, role}) =>
  dispatch => {
    const data = {id, email, token, image, address, phone_number, role};
    dispatch({
      type: ADD_USER_INFO,
      payload: data,
    });
  };
export const userUpdate =
  ({image, address, phone_number}) =>
  dispatch => {
    const data = {image, address, phone_number};
    dispatch({
      type: UPDATE_USER_INFO,
      payload: data,
    });
  };

export const userLogout = () => dispatch => {
  dispatch({type: REMOVE_USER_INFO, payload: {}});
};
