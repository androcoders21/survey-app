import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { set } from "zod";

interface UserState {
    token: string;
    userId: string;
    ulbCode: string;
}

const initialState: UserState = {
    token: "",
    userId: "",
    ulbCode: "",
};

const userSlice = createSlice({
    initialState,
    name:"user",
    reducers:{
        setUserToken:(state,action:PayloadAction<string>)=>{
            state.token = action.payload;
        },
        setUserId:(state,action:PayloadAction<string>)=>{
            state.userId = action.payload;
        },
        setUlbCode:(state,action:PayloadAction<string>)=>{
            state.ulbCode = action.payload;
        },
    }
});

export const {setUserToken,setUserId,setUlbCode} = userSlice.actions;
export default userSlice.reducer;