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
        // new apis
        fetchTaxRate:builder.query<any,void>({
            query:()=>'current-tax-rate-zone',
        }),
        fetchPropertyOwnership:builder.query<any,void>({
            query:()=>'property-ownerships',
        }),
        fetchPropertySituation:builder.query<any,void>({
            query:()=>'property-owner-sections',
        }),
        fetchPropertyUses:builder.query<any,void>({
            query:()=>'property-uses',
        }),
        fetchCommercialUses:builder.query<any,void>({
            query:()=>'property-commercial-uses',
        }),
        fetchYearOfConstruction:builder.query<any,void>({
            query:()=>'property-year-of-constructions',
        }),
        fetchExemption:builder.query<any,void>({
            query:()=>'property-owner-sections',
        }),
    })
});

export const {useFetchPropertyQuery,useFetchLandLocatedQuery,useFetchFloorTypeQuery,useFetchBuildingOccupiedByQuery,useFetchNatureOfConstructionQuery,useFetchLandmarksQuery,useFetchTaxRateQuery,useFetchPropertyOwnershipQuery,useFetchPropertySituationQuery,useFetchPropertyUsesQuery,useFetchCommercialUsesQuery,useFetchYearOfConstructionQuery,useFetchExemptionQuery} = propertyType;