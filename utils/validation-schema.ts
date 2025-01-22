import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, { message: "Minimum 8 characters are required" }).max(30, { message: "Maximum 30 characters are allowed" }),
});

export const surveySchema = z.object({
    nameOfOwner: z.string().min(3, { message: "Minimum 3 characters are required" }).max(30, { message: "Maximum 30 characters are allowed" }),
    fatherNameOfOwner: z.string().min(3, { message: "Minimum 3 characters are required" }).max(30, { message: "Maximum 30 characters are allowed" }),
    email: z.string()
        .optional() // Makes the field optional
        .refine((value) => value === undefined || value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
            message: "Invalid email address",
        }),
    mobile: z.string().regex(/^\d{10}$/, { message: "Mobile number must be exactly 10 digits" }),
    building_house_plot: z.string().min(1, { message: "Minimum 1 characters are required" }).max(50, { message: "Maximum 50 characters are allowed" }),
    address_of_residence: z.string().min(3, { message: "Minimum 3 characters are required" }).max(200, { message: "Maximum 200 characters are allowed" }),
    landmark: z.string().optional(),
    area: z.string().min(3, { message: "Minimum 3 characters are required" }).max(100, { message: "Maximum 100 characters are allowed" }),
    city: z.string().min(3, { message: "Minimum 3 characters are required" }).max(30, { message: "Maximum 30 characters are allowed" }),
    state: z.string().min(3, { message: "Minimum 3 characters are required" }).max(30, { message: "Maximum 30 characters are allowed" }),
    pincode: z.string().min(6, { message: "Minimum 6 characters are required" }).max(6, { message: "Maximum 6 characters are allowed" }),
    ward_name: z.string(),
    udf1: z.string().optional(),
    udf2: z.string().optional(),
    udf3: z.string().regex(/^\d+$/, { message: 'Must be a number' }).min(2, { message: "Minimum 2 digits are required" }).max(30, { message: "Maximum 30 digits are allowed" }),
    udf4: z.string().optional().refine((value) => value === undefined || value === "" || /^\d{10}$/.test(value), {
        message: "Mobile number must be exactly 10 digits",
    })
});

export const surveyStepTwoSchema = z.object({
    floor: z.array(z.object({
        property_type: z.string().refine((val) => val !== "", { message: "Required" }),
        property_occupied_by: z.string().refine((val) => val !== "", { message: "Required" }),
        floor_type: z.string().refine((val) => val !== "", { message: "Required" }),
        covered_area: z.string()
            .regex(/^\d+(\.\d+)?$/, { message: "Must be a positive number (e.g., '150.5')" })
            .max(30, { message: "Maximum 30 characters are allowed" })
            .refine((val) => parseFloat(val) >= 0, { message: "Value must be greater than 0" }),
        open_area: z.string()
            .regex(/^\d+(\.\d+)?$/, { message: "Must be a positive number (e.g., '150.5')" })
            .max(30, { message: "Maximum 30 characters are allowed" })
            .refine((val) => parseFloat(val) >= 0, { message: "Value must be greater than 0" }),
        other_area: z.string()
            .regex(/^\d+(\.\d+)?$/, { message: "Must be a positive number (e.g., '150.5')" })
            .max(30, { message: "Maximum 30 characters are allowed" })
            .refine((val) => parseFloat(val) >= 0, { message: "Value must be greater than 0" }),
        all_room: z.string()
            .regex(/^\d+(\.\d+)?$/, { message: "Must be a positive number (e.g., '150.5')" })
            .max(30, { message: "Maximum 30 characters are allowed" })
            .refine((val) => parseFloat(val) >= 0, { message: "Value must be greater than 0" }),
        all_balcony: z.string()
            .regex(/^\d+(\.\d+)?$/, { message: "Must be a positive number (e.g., '150.5')" })
            .max(30, { message: "Maximum 30 characters are allowed" })
            .refine((val) => parseFloat(val) >= 0, { message: "Value must be greater than 0" }),
        all_garages: z.string()
            .regex(/^\d+(\.\d+)?$/, { message: "Must be a positive number (e.g., '150.5')" })
            .max(30, { message: "Maximum 30 characters are allowed" })
            .refine((val) => parseFloat(val) >= 0, { message: "Value must be greater than 0" }),
    })).min(1, { message: 'Minimum 1 floor is required' }),
    details_of_building_carpet_area: z.string().min(3, { message: "Minimum 3 characters are required" }).max(200, { message: "Maximum 200 characters are allowed" }),
    details_of_location_a_is_located: z.string().min(1, { message: "Minimum 1 characters are required" }).max(200, { message: "Maximum 200 characters are allowed" }),
    details_of_location_b_nature: z.string().min(1, { message: "Minimum 1 characters are required" }).max(200, { message: "Maximum 200 characters are allowed" }),
    // is_occupied_by: z.string().min(2, { message: "Minimum 2 characters are required" }).max(100, { message: "Maximum 100 characters are allowed" }),
    year_of_construction: z.string().regex(/^\d{4}$/, { message: "Year of construction must be a 4-digit number" }) // Ensure 4-digit string
        .refine(
            (val) => {
                const year = parseInt(val, 10);
                return year >= 1800 && year <= 2024;
            },
            { message: "Year of construction must be between 1800 and 2024" }
        ),
});

export const surveyStepThreeSchema = z.object({
    img1: z.union([
        z.object({
            name: z.string().nonempty("File name is required"),
            uri: z.string().nonempty("File URI must be a valid URL"),
            type: z.string().nonempty("File type is required"),
            size: z.number().positive("File size must be greater than 0").max(2 * 1024 * 1024, { message: "File size must be less than 2MB" })
        }),
        z.string().nonempty("Path is required")
    ]),
    img2: z.union([
        z.object({
            name: z.string().nonempty("File name is required"),
            uri: z.string().nonempty("File URI must be a valid URL"),
            type: z.string().nonempty("File type is required"),
            size: z.number().positive("File size must be greater than 0").max(2 * 1024 * 1024, { message: "File size must be less than 2MB" })
        }),
        z.string().nonempty("Path is required")
    ]),
    img3: z.union([
        z.object({
            name: z.string().nonempty("File name is required"),
            uri: z.string().nonempty("File URI must be a valid URL"),
            type: z.string().nonempty("File type is required"),
            size: z.number().positive("File size must be greater than 0").max(2 * 1024 * 1024, { message: "File size must be less than 2MB" })
        }),
        z.string().nonempty("Path is required")
    ]),
    img4: z.union([
        z.object({
            name: z.string().nonempty("File name is required"),
            uri: z.string().nonempty("File URI must be a valid URL"),
            type: z.string().nonempty("File type is required"),
            size: z.number().positive("File size must be greater than 0").max(2 * 1024 * 1024, { message: "File size must be less than 2MB" })
        }),
        z.string().nonempty("Path is required")
    ]).optional().nullable(),  // Optional field
    img5: z.union([
        z.object({
            name: z.string().nonempty("File name is required"),
            uri: z.string().nonempty("File URI must be a valid URL"),
            type: z.string().nonempty("File type is required"),
            size: z.number().positive("File size must be greater than 0").max(2 * 1024 * 1024, { message: "File size must be less than 2MB" })
        }),
        z.string().nonempty("Path is required")
    ]).optional().nullable(),  // Optional field
    img6: z.union([
        z.object({
            name: z.string().nonempty("File name is required"),
            uri: z.string().nonempty("File URI must be a valid URL"),
            type: z.string().nonempty("File type is required"),
            size: z.number().positive("File size must be greater than 0").max(2 * 1024 * 1024, { message: "File size must be less than 2MB" })
        }),
        z.string().nonempty("Path is required")
    ]).optional().nullable(),   // Optional field,
    udf1: z.string().optional(),
    udf2: z.string().optional(),
});

export const step1Schema = z.object({
    ulbNameCode: z.string().min(3, { message: "Minimum 3 characters are required" }),
    wardNo: z.string().min(1, "Ward No is required"),
    nagarpalikaId: z.string().optional(),
    parcelNo: z.string().min(3, { message: "Minimum 3 characters are required" }),
    propertyNo: z.string().min(1, { message: "Minimum 1 character is required" }),
    electricityId: z.string().optional(),
    khasraNo: z.string().optional(),
    registryNo: z.string().optional(),
    constructedDate: z.string().optional(),
    isSlum: z.string(),
    slumId: z.string().optional(),
});

export const step2Schema = z.object({
    respondentName: z.string().min(3, { message: "Minimum 3 characters are required" }),
    respondentRelationship: z.string().min(3, { message: "Minimum 3 characters are required" }),
    respondentRelationshipOther: z.string().optional(),
    ownerAadhaarNumber: z.string().optional()
        .refine((value) => value === undefined || value === "" || /^\d{12}$/.test(value), { message: "Aadhaar number must be 12 digits" }),
    aadhaarPhoto: z.string().optional(),
    ownerDetails: z.array(z.object({
        name: z.string().min(3, { message: "Minimum 3 characters are required" }),
        fatherName: z.string().min(3, { message: "Minimum 3 characters are required" }),
        mobile: z.string().regex(/^\d{10}$/, "Mobile number must be 10 digits"),
        landline: z.string().optional(),
        email: z.string()
            .optional() // Makes the field optional
            .refine((value) => value === undefined || value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
                message: "Invalid email address",
            }),
    })).min(1, "At least one owner is required"),
}).refine(
    (data) => {
        if (data.respondentRelationship === "Other" && !data.respondentRelationshipOther) {
            return false;
        }
        return true;
    },
    {
        message: "Property Ownership Other is required when 'Other' is selected",
        path: ["respondentRelationshipOther"], // Path to the field that will show the error
    }
);

export const step3Schema = z.object({
    houseNo: z.string().min(1, { message: "Minimum 1 characters are required" }),
    streetNoName: z.string().min(3, { message: "Minimum 3 characters are required" }),
    locality: z.string().min(3, { message: "Minimum 3 characters are required" }),
    colony: z.string().min(3, { message: "Minimum 3 characters are required" }),
    colonyOther: z.string().optional(),
    city: z.string().min(3, { message: "Minimum 3 characters are required" }),
    pincode: z.string().min(6, "Pincode must be 6 digits").max(6, "Pincode must be 6 digits"),
    isSameAsProperty: z.boolean().optional(),
    presentHouseNo: z.string().min(1, { message: "Minimum 1 characters are required" }),
    presentStreetNoName: z.string().min(3, { message: "Minimum 3 characters are required" }),
    presentLocality: z.string().min(3, { message: "Minimum 3 characters are required" }),
    presentColony: z.string().min(3, { message: "Minimum 3 characters are required" }),
    presentCity: z.string().min(3, { message: "Minimum 3 characters are required" }),
    presentPincode: z.string().min(6, "Present Pincode must be 6 digits").max(6, "Present Pincode must be 6 digits"),
});

export const step4Schema = z.object({
    taxRateZone: z.string().min(1, "Taxrate zone is required"),
    taxRateZoneOther: z.string().optional(),
    propertyOwnership: z.string().min(1, "Property Ownership is required"),
    propertyOwnershipOther: z.string().optional(),
    situation: z.string().min(1, "Situation is required"),
    situationOther: z.string().optional(),
    propertyUse: z.string().min(1, "Property Use is required"),
    propertyOther: z.string().optional(),
    commercial: z.string().optional(),
    commercialOther: z.string().optional(),
    yearOfConstruction: z.string().min(1, "Property Ownership is required"),
    yearOfConstructionOther: z.string().optional(),
    isExemptionApplicable: z.string().optional(),
    exemptionType: z.string().optional(),
    exemptionTypeOther: z.string().optional(),
}).refine(
    (data) => {
        if (data.taxRateZone === "Other" && !data.taxRateZoneOther) {
            return false;
        }
        return true;
    },
    {
        message: "Taxrate zone Other is required when 'Other' is selected",
        path: ["taxRateZoneOther"], // Path to the field that will show the error
    }
).refine(
    (data) => {
        if (data.propertyOwnership === "Other" && !data.propertyOwnershipOther) {
            return false;
        }
        return true;
    },
    {
        message: "Property Ownership Other is required when 'Other' is selected",
        path: ["propertyOwnershipOther"], // Path to the field that will show the error
    }
).refine(
    (data) => {
        // If situation is "Other", situationOther is required
        if (data.situation === "Other" && !data.situationOther) {
            return false;
        }
        return true;
    },
    {
        message: "Situation Other is required when 'Other' is selected",
        path: ["situationOther"],
    }
)
    .refine(
        (data) => {
            // If propertyUse is "Other", propertyOther is required
            if (data.propertyUse === "Other" && !data.propertyOther) {
                return false;
            }
            return true;
        },
        {
            message: "Property Other is required when 'Other' is selected",
            path: ["propertyOther"],
        }
    )
    .refine(
        (data) => {
            // If commercial is "Other", commercialOther is required
            if (data.commercial === "NA" && !data.commercialOther) {
                return false;
            }
            return true;
        },
        {
            message: "Commercial Other is required when 'Other' is selected",
            path: ["commercialOther"],
        }
    ).refine(
        (data) => {
            // If exemptionType is "Other", exemptionTypeOther is required
            if (data.yearOfConstruction === "Other" && !data.yearOfConstructionOther) {
                return false;
            }
            return true;
        },
        {
            message: "Required",
            path: ["yearOfConstructionOther"],
        }
    ).refine(
        (data) => {
            // If exemptionType is "Other", exemptionTypeOther is required
            if (data.isExemptionApplicable === "yes" && !data.exemptionType) {
                return false;
            }
            return true;
        },
        {
            message: "Exemption Type is required when 'Yes' is selected",
            path: ["exemptionType"],
        }
    )
    .refine(
        (data) => {
            // If exemptionType is "Other", exemptionTypeOther is required
            if (data.isExemptionApplicable === "yes" && data.exemptionType === "Other" && !data.exemptionTypeOther) {
                return false;
            }
            return true;
        },
        {
            message: "Exemption Type Other is required when 'Other' is selected",
            path: ["exemptionTypeOther"],
        }
    );

export const step5Schema = z.object({
    plotAreaSqFt: z.string().min(1, "Plot Area (Square Feet) is required"),
    plotAreaSqMeter: z.string().min(1, "Plot Area (Square Meter) is required"),
    plinthAreaSqFt: z.string().min(1, "Plinth Area (Square Feet) is required"),
    plinthAreaSqMeter: z.string().min(1, "Plinth Area (Square Meter) is required"),
    totalBuiltUpAreaSqFt: z.string().optional(),
    totalBuiltUpAreaSqMeter: z.string().optional(),
    floors: z.array(z.object({
        floorType: z.string().min(1, "Floor Type is required"),
        floorTypeOther: z.string().optional(),
        areaSqFt: z.string(),
        areaSqMt: z.string(),
        usageType: z.string().min(1, "Other Area is required"),
        usageTypeOther: z.string().optional(),
        usageFactor: z.string().min(1, "All Room is required"),
        usageFactorOther: z.string().optional(),
        constructionType: z.string().min(1, "All Balcony is required"),
        constructionTypeOther: z.string().optional(),
    })).min(1, "At least one floor is required"),
}).refine(
    (data) => {
        // Convert string values to numbers for comparison
        const plotAreaSqFt = parseFloat(data.plotAreaSqFt);
        const plinthAreaSqFt = parseFloat(data.plinthAreaSqFt);

        // Ensure plotAreaSqMeter is greater than plinthAreaSqMeter
        return plotAreaSqFt > plinthAreaSqFt;
    },
    {
        message: "Plot Area must be greater than Plinth Area",
        path: ["plotAreaSqFt"], // Path to the field that will show the error
    }
);


export const step6Schema = z.object({
    isMuncipalWaterSupply: z.string().min(1, "Municipal Water Supply is required"),
    totalWaterConnection: z.string().optional().refine((value) => value === undefined || value === "" || /^\d+$/.test(value), {
        message: "Must be a number",
    }),
    waterConnectionId: z.array(z.string()).optional(),
    waterConnectionType: z.string().optional(),
    waterConnectionTypeOther: z.string().optional(),
    sourceOfWater: z.string().optional(),
    sourceOfWaterOther: z.string().optional(),
    toiletType: z.string().min(1, "Type of Toilet is required"),
    toiletTypeOther: z.string().optional(),
    isMuncipalWasteService: z.string().min(1, "Solid Waste Service Available is required"),
}).refine((data) => {
    if (data.isMuncipalWaterSupply === "yes" && !data.totalWaterConnection) {
        return false;
    }
    return true;
}, {
    message: "Total Water Connection is required",
    path: ["totalWaterConnection"]
}).refine((data)=>{
    if (data.isMuncipalWaterSupply === "yes") {
        if (!data.waterConnectionId || data.waterConnectionId.length === 0) {
            return false;
        }
        const unique = new Set(data.waterConnectionId[0].split(','));
        if (data.totalWaterConnection && Number(data.totalWaterConnection) !== unique.size) {
            return false;
        }
    }
    return true;
},{
    message: "Water Connection Id must be unique and equal to Total Water Connection",
    path: ["waterConnectionId"]
}).refine((data) => {
    if (data.isMuncipalWaterSupply === "yes" && !data.waterConnectionType) {
        return false;
    }
    return true;
}, {
    message: "Water Connection Type is required",
    path: ["waterConnectionType"]
}).refine((data) => {
    if (data.isMuncipalWaterSupply === "yes" && data.waterConnectionType === "Other" && !data.waterConnectionTypeOther) {
        return false;
    }
    return true;
}, {
    message: "Water Connection Type Other is required",
    path: ["waterConnectionTypeOther"]
}).refine((data) => {
    if (data.isMuncipalWaterSupply === "no" && !data.sourceOfWater) {
        return false;
    }
    return true;
}, {
    message: "Source of Water is required",
    path: ["sourceOfWater"]
}).refine((data) => {
    if (data.isMuncipalWaterSupply === "no" && data.sourceOfWater === "Other" && !data.sourceOfWaterOther) {
        return false;
    }
    return true;
}
    , {
        message: "Source of Water Other is required",
        path: ["sourceOfWaterOther"]
    }).refine((data) => {
        if (data.toiletType === "Other" && !data.toiletTypeOther) {
            return false;
        }
        return true;
    },
        {
            message: "Type of Toilet Other is required",
            path: ["toiletTypeOther"]
        });

export const step7Schema = z.object({
    propertyFirstImage: z.object({
        name: z.string().nonempty("File name is required"),
        uri: z.string().nonempty("File URI must be a valid URL"),
        type: z.string().nonempty("File type is required"),
        size: z.number().positive("File size must be greater than 0")
    }),
    propertySecondImage: z.object({
        name: z.string().nonempty("File name is required"),
        uri: z.string().nonempty("File URI must be a valid URL"),
        type: z.string().nonempty("File type is required"),
        size: z.number().positive("File size must be greater than 0")
    }),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    supportingDocuments: z.array(z.object({
        name: z.string().optional(),
        uri: z.string().optional(),
        type: z.string().optional(),
        size: z.number().positive("File size must be greater than 0").optional(),
    }),).optional(),
    remark: z.string().optional(),
});

export const floorDetailsSchema = z.object({
    floorType: z.string().min(1, "Floor Type is required"),
    floorTypeOther: z.string().optional(),
    areaSqFt: z.string(),
    areaSqMt: z.string(),
    usageType: z.string().min(1, "Other Area is required"),
    usageTypeOther: z.string().optional(),
    usageFactor: z.string().min(1, "All Room is required"),
    usageFactorOther: z.string().optional(),
    constructionType: z.string().min(1, "All Balcony is required"),
    constructionTypeOther: z.string().optional(),
}).refine((data) => {
    if (data.floorType === "Other" && !data.floorTypeOther) {
        return false;
    }
    return true;
}, {
    message: "Required",
    path: ["floorTypeOther"]
}).refine(
    (data) => {
        if (data.usageType === "Other" && !data.usageTypeOther) {
            return false;
        }
        return true;
    },
    {
        message: "Required",
        path: ["usageTypeOther"]
    }).refine(
        (data) => {
            if (data.usageFactor === "Other" && !data.usageFactorOther) {
                return false;
            }
            return true;
        },
        {
            message: "Required",
            path: ["usageFactorOther"]
        }).refine((data) => {
            if (data.constructionType === "Other" && !data.constructionTypeOther) {
                return false;
            }
            return true;
        }
            , {
                message: "Required",
                path: ["constructionTypeOther"]
            });

export const ownerDetailsSchema = z.object({
    name: z.string().min(3, { message: "Minimum 3 characters are required" }),
    fatherName: z.string().min(3, { message: "Minimum 3 characters are required" }),
    mobile: z.string().regex(/^\d{10}$/, "Mobile number must be 10 digits"),
    landline: z.string().optional(),
    email: z.string()
        .optional() // Makes the field optional
        .refine((value) => value === undefined || value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
            message: "Invalid email address",
        }),
});

export type OwnerDetailsType = z.infer<typeof ownerDetailsSchema>;
export type FloorDetailsType = z.infer<typeof floorDetailsSchema>;

export type Step1Type = z.infer<typeof step1Schema>;
export type Step2Type = z.infer<typeof step2Schema>;
export type Step3Type = z.infer<typeof step3Schema>;
export type Step4Type = z.infer<typeof step4Schema>;
export type Step5Type = z.infer<typeof step5Schema>;
export type Step6Type = z.infer<typeof step6Schema>;
export type Step7Type = z.infer<typeof step7Schema>;

export type CombinedSurveyType = Step1Type & Step2Type & Step3Type & Step4Type & Step5Type & Step6Type & Step7Type;

export type LoginType = z.infer<typeof loginSchema>;

export type SurveyType = z.infer<typeof surveySchema>;

export type SurveyStepThreeType = z.infer<typeof surveyStepThreeSchema>;

export type SurveyStepTwoType = z.infer<typeof surveyStepTwoSchema>;