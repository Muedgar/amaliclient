import { createSlice } from "@reduxjs/toolkit";
import getAccessToken from "../logic/getAccessToken";
import getUserData from "../logic/getUserData";


export const gitAppSlice = createSlice({
    name: 'gitApp',
    initialState: [
             
        ],
    reducers: {
        manageAccess: (state,action) => {
           state.push(action.payload);
        }
    }
});


export const {
    manageAccess
} = gitAppSlice.actions;

export default gitAppSlice.reducer;