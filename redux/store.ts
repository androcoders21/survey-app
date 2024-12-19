import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/api-slice";
import { setupListeners } from "@reduxjs/toolkit/query";
import userReducer from "./slices/user"
import surveyReducer from "./slices/survey"

export const store = configureStore({
    reducer:{
        user:userReducer,
        survey:surveyReducer,
        [apiSlice.reducerPath]:apiSlice.reducer,
    },
    middleware:(getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});

setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;