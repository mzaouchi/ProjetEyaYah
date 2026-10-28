import { combineReducers } from "redux";
import { UsersReducer } from "./UsersReducer";
import { AnlyseReducer } from "./AnalyseReducer";

const rootReducer = combineReducers({
  UsersReducer,
  AnlyseReducer
});

export default rootReducer;
