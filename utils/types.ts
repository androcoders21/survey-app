export interface LoginResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export interface ErrorResponseType {
    error: string;
    message: any;
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
    floors?: FloorDataType[];
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

export type FloorType = {
    floor_type: string;
    property_type: string;
    property_occupied_by: string;
    covered_area: string;
    open_area: string;
    other_area: string;
    all_room: string;
    all_balcony: string;
    all_garages: string;
};

export type PropertyType = {
    id: number;
    status: string;
    type_description: string;
    type_name: string;
    created_at: string;
    updated_at: string;
};

export type LandLocatedType = {
    created_at: string; // ISO 8601 date string
    id: number; // Unique identifier
    name: string; // Description of the road
    status: string; // Status as a string (e.g., "1")
    updated_at: string; // ISO 8601 date string
};

export type BuildingNatureType = {
    id: number; // Unique identifier for the building
    name: string; // Name or description of the building type
    status: string; // Status, possibly indicating whether active or not (e.g., "1" for active)
    created_at: string; // Timestamp indicating when the record was created
    updated_at: string; // Timestamp indicating when the record was last updated
};

export type OccupiedType = {
    id: number; // Unique identifier for the role
    name: string; // Name or title of the role
    status: string; // Status, possibly indicating if active (e.g., "1" for active)
    created_at: string; // Timestamp of when the role was created
    updated_at: string; // Time stamp indicating when the record was last updated
};

export type LandMarkType = {
    id: number; // Unique identifier
    name: string; // Name of the interior or related description
    status: string; // Status of the item (e.g., "1" for active)
    created_at: string; // Timestamp of creation in ISO 8601 format
    updated_at: string; // Timestamp of last update in ISO 8601 format
};

export type FloorTypeType = {
    id: number; // Unique identifier
    name: string; // Name of the interior or related description
    status: string; // Status of the item (e.g., "1" for active)
    created_at: string; // Timestamp of creation in ISO 8601 format
    updated_at: string; // Timestamp of last update in ISO 8601 format
}

export interface FloorDataType {
    id: number; 
    floor_type: FloorTypeType;
    property_type: PropertyType;
    property_occupied_by: number; 
    covered_area: string; 
    open_area: string; 
    other_area: string; 
    all_room: string; 
    all_balcony: string; 
    all_garages: string; 
    properties_id: number; 
    created_at: string; 
    updated_at: string; 
    occupied_by: OccupiedType;
};

export interface MapType {
    latitude: number;
    longitude: number;
}

