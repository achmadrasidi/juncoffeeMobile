import {ADD_TO_CART, REMOVE_CART, UPDATE_CART} from "../constant/cartConstant";

export const addToCart = product => dispatch => {
  dispatch({
    type: ADD_TO_CART,
    payload: product,
  });
};
export const updateCart = product => dispatch => {
  dispatch({
    type: UPDATE_CART,
    payload: product,
  });
};
export const removeCart = item => dispatch => {
  dispatch({
    type: REMOVE_CART,
    payload: item,
  });
};
