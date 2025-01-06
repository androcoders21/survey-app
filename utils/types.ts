export interface LoginResponse {
    access_token:string;
    token_type:string;
    expires_in:number;
}

export interface ErrorResponseType {
    error:string;
    message:any;
}

export interface WardType {
    "created_at": null | string, 
    "ditrict": string,
    "id": number,  
    "name": string, 
    "updated_at": null | string, 
    "ward_number": string
}

export interface SurveyDetailsType {
    id: number;
    property_id: string;
    nameOfOwner: string;
    fatherNameOfOwner: string;
    email: string;
    mobile: string;
    building_house_plot: string;
    address_of_residence: string;
    ward_name: string;
    area: string;
    landmark: string;
    city: string;
    state: string;
    pincode: string;
    details_of_building_covered_area: string;
    details_of_building_open_area: string;
    details_of_building_other_details: string;
    details_of_building_internal_dim_all_room: string;
    details_of_building_internal_dim_all_balcony: string;
    details_of_building_internal_dim_all_garages: string;
    details_of_building_carpet_area: string;
    details_of_location_a_is_located: string;
    details_of_location_b_nature: string;
    is_occupied_by: string;
    year_of_construction: string;
    user_id: number;
    img1: string | null;
    img2: string | null;
    img3: string | null;
    img4: string | null;
    img5: string | null;
    img6: string | null;
    udf1: string | null;
    udf2: string | null;
    udf3: string | null;
    udf4: string | null;
    udf5: string | null;
    udf6: string | null;
    status: number;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
    ward: WardType;
  }

export enum PressTypes {
    EDIT = "EDIT",
    VIEW = "VIEW"
}
  
export type UserType = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    mobile: string;
    address: string;
    profile: string;
    aadhar: string;
    pan: string;
    roll_id: number;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
  };
  
