import { applyMiddleware } from "redux";
import { createStore } from "redux";
import reducer from "./features/reducer";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

export default createStore(
  reducer,
  composeWithDevTools(applyMiddleware(thunk))
);
