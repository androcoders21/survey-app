import { apiSlice } from "../api-slice";

const survey = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        fetchSurveys:builder.query<any,void>({
            query:()=>({
                url:'survey-forms',
                method:'GET',
            }),
        }),
        createSurvey:builder.mutation<any,any>({
            query:(data)=>({
                url:'survey-form',
                method:'POST',
                body:data,
                // headers:{
                //     'Content-Type':'multipart/form-data',
                // },
            }),
            
        }),
        updateSurvey:builder.mutation<any,{data:any,id:string}>({
            query:({data, id})=>({
                url:`survey-form/${id}`,
                method:'POST',
                body:data,
            }),
        }),
        fetchUserServey:builder.query<any,{userId:string,page:number}>({
            query:({userId,page})=>({
                url:`survey-forms?user_id=${userId}&per_page=10&page=${page}`,
            }),
        }),
        createProperty:builder.mutation<any,any>({
            query:(data)=>({
                url:'properties',
                method:'POST',
                body:data,
            }),
        }),
        fetchPropertyById:builder.query<any,{id:string}>({
            query:({id})=>({
                url:`properties?id=${id}`,
                method:'GET',
            }),
        }),
    }),
});

export const {useFetchSurveysQuery,useCreateSurveyMutation,useFetchUserServeyQuery,useUpdateSurveyMutation,useCreatePropertyMutation,useFetchPropertyByIdQuery} = survey;