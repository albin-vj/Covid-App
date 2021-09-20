import { createStore } from "redux";
import  reducer  from "../reducers";
import {initialState} from "../InitialState";

export default store = createStore(reducer, initialState);
