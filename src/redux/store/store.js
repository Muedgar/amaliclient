import {configureStore} from "@reduxjs/toolkit";
import gitAppSlice from "./slice";

export default configureStore({
    reducer: {
        gitAppStore: gitAppSlice
    }
});