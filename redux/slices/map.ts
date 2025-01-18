import { MapType } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState:MapType = {
    latitude: 27.1767,
    longitude: 78.0081,
};

const mapSlice = createSlice({
    initialState,
    name:"map",
    reducers:{
        setMap:(state,action:PayloadAction<MapType>)=>{
            state.latitude = action.payload.latitude;
            state.longitude = action.payload.longitude;
        }
    }
});

export const {setMap} = mapSlice.actions;
export default mapSlice.reducer;