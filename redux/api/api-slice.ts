import { getFromLocal } from "@/utils/helper";
import { useAppSelector } from "@/utils/hooks";
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { RootState } from "../store";

let apiToken:string|undefined = undefined;

getFromLocal("@token").then((data)=>{
    apiToken = data;
});



export const baseUrl = 'https://app.npanandnagar.in/api/';
export const apiSlice = createApi({
    baseQuery:fetchBaseQuery({
        baseUrl,
        prepareHeaders(headers, {getState}) {
            headers.set('Accept', 'application/json');
            const token = (getState() as RootState).user.token;
            if(token){
                headers.set('Authorization', `Bearer ${token}`);
            }
        },
    }),
    refetchOnFocus: true,
    endpoints:()=>({ }),
})

