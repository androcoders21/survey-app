import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { set } from "zod";

interface UserState {
    token: string;
    userId: string;
}

const initialState: UserState = {
    token: "",
    userId: "",
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
        }
    }
});

export const {setUserToken,setUserId} = userSlice.actions;
export default userSlice.reducer;