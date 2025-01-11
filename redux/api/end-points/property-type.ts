import { apiSlice } from "../api-slice";

const propertyType = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        fetchProperty:builder.query<any,void>({
            query:()=>'property-types',
        }),
        fetchLandLocated:builder.query<any,void>({
            query:()=>'land-is-located',
        }),
        fetchFloorType:builder.query<any,void>({
            query:()=>'floor-type',
        }),
        fetchBuildingOccupiedBy:builder.query<any,void>({
            query:()=>'building-occupied',
        }),
        fetchNatureOfConstruction:builder.query<any,void>({
            query:()=>'nature-of-construction',
        }),
        fetchLandmarks:builder.query<any,void>({
            query:()=>'landmark-types',
        }),
    })
});

export const {useFetchPropertyQuery,useFetchLandLocatedQuery,useFetchFloorTypeQuery,useFetchBuildingOccupiedByQuery,useFetchNatureOfConstructionQuery,useFetchLandmarksQuery} = propertyType;