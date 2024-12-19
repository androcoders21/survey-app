import { LoginType } from "@/utils/validation-schema";
import { apiSlice } from "../api-slice";
import { LoginResponse } from "@/utils/types";

const user = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        loginUser:builder.mutation<LoginResponse,LoginType>({
            query:(data)=>({
                url:'auth/login',
                method:'POST',
                body:data,
            }),
        }),
        refereshToken:builder.query({
            query:()=>({
                url:'refresh',
                method:'POST',
            }),
        }),
        getUserDetails:builder.mutation({
            query:()=>({
                url:'me',
                method:'POST',
            }),
        })
    })
})

export const {useLoginUserMutation,useRefereshTokenQuery,useGetUserDetailsMutation} = user;