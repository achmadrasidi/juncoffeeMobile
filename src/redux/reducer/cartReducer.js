import {ADD_TO_CART, REMOVE_CART, UPDATE_CART} from "../constant/cartConstant";
export const cartInfoReducer = (state = {cartItems: []}, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const {data} = action.payload;

      const prevItems = [...state.cartItems];
      const cartItems = [
        {
          id: data.id,
          name: data.name,
          image: data.image,
          price: data.price,
        },
      ];

      if (prevItems.length) {
        const prevItemsIndex = prevItems.findIndex(val => val.id === data.id);
        if (prevItemsIndex > -1) {
          return {...state, cartItems: prevItems};
        }
        const objCartItems = Object.assign(...cartItems);
        return {...state, cartItems: [...prevItems, objCartItems]};
      }
      return {...state, cartItems};
    case UPDATE_CART:
      return {...state, cartItems: action.payload};
    case REMOVE_CART:
      return {
        ...state,
        cartItems: action.payload,
      };
    default:
      return state;
  }
};
