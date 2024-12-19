import { apiSlice } from "../api-slice";

const ward = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        fetchWard:builder.query<any,void>({
            query:()=>'wards',
        })
    })
})

export const {useFetchWardQuery} = ward;