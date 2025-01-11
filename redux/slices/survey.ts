import { SurveyDetailsType } from "@/utils/types";
import { SurveyType } from "@/utils/validation-schema";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: SurveyDetailsType = {
    id: 0, // Default ID
    property_id: "", // Default empty string
    nameOfOwner: "",
    fatherNameOfOwner: "",
    email: "",
    mobile: "",
    building_house_plot: "",
    address_of_residence: "",
    ward_name: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    details_of_building_covered_area: "",
    details_of_building_open_area: "",
    details_of_building_other_details: "",
    details_of_building_internal_dim_all_room: "",
    details_of_building_internal_dim_all_balcony: "",
    details_of_building_internal_dim_all_garages: "",
    details_of_building_carpet_area: "",
    details_of_location_a_is_located: "",
    details_of_location_b_nature: "",
    is_occupied_by: "",
    year_of_construction: "",
    user_id: 0, // Default user ID
    img1: null,
    img2: null,
    img3: null,
    img4: null,
    img5: null,
    img6: null,
    udf1: null,
    udf2: null,
    udf3: null,
    udf4: null,
    udf5: null,
    udf6: null,
    status: 0, // Default status
    created_at: "", // Default empty string for date
    updated_at: "", // Default empty string for date
    ward: {
        created_at: null,
        ditrict: "",
        id: 0,
        name: "",
        updated_at: null,
        ward_number: ""
    },
    floors: [],
  };

const surveySlice = createSlice({
    initialState,
    name:'survey',
    reducers:{
        setSlectedSurvey:(state,action:PayloadAction<SurveyDetailsType>)=>{
            return {
                ...state,
                ...action.payload,
                floors: action.payload.floors || []
            }
        }
    }
});

export const {setSlectedSurvey} = surveySlice.actions;
export default surveySlice.reducer;