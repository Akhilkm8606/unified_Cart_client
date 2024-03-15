import axios from "axios";
import {
  ALL_PRODUCTS_REQUEST,
  ALL_PRODUCTS_SUCCESS,
  ALL_PRODUCTS_FAILURE,

  PRODUCTS_DETAILS_REQUEST,
  PRODUCTS_DETAILS_SUCCESS,
  PRODUCTS_DETAILS_FAILURE,

  CLEAR_ERRORS,
} from "../Constants/ProductConstants";

export const getProducts = () => async (dispatch) =>{
  try {
    dispatch({
      type: ALL_PRODUCTS_REQUEST
    });

    const response = await axios.get('http://localhost:5000/products');
// console.log(response.data,"hghg");
    dispatch({
      type: ALL_PRODUCTS_SUCCESS,
      payload: response.data // Pass only the relevant data from the response
    });
  } catch (error) {
    dispatch({
      type: ALL_PRODUCTS_FAILURE,
      payload: error.response // Pass only the error response
    });
  }
}
export const getProductDetails = (id) => async (dispatch) =>{
  try {
    dispatch({
      type: PRODUCTS_DETAILS_REQUEST
    });

    const response = await axios.get(`http://localhost:5000/product/${id}`);
console.log(response.data.product,"details");
    dispatch({
      type: PRODUCTS_DETAILS_SUCCESS,
      payload: response.data.product
    });
  } catch (error) {
    dispatch({
      type: PRODUCTS_DETAILS_FAILURE,
      payload: error.response // Pass only the error response
    });
  }
}

export const clearError = () => async (dispatch) =>{
  dispatch({
    type: CLEAR_ERRORS
  });
}

