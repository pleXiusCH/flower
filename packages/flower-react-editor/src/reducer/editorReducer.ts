import { Reducer, ReducerAction } from "react";

export const SET_WINDOW_VIEW = 'SET_WINDOW_VIEW';

export const editorReducer: Reducer<any, any> = (state, action) => {
  switch (action.type) {
    case SET_WINDOW_VIEW:
      
    default:
      return state;
  }
}