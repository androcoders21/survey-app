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
    udf3: z.string().regex(/^\d+$/,{message:'Must be a number'}).min(2, { message: "Minimum 2 digits are required" }).max(30, { message: "Maximum 30 digits are allowed" }),
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

export type LoginType = z.infer<typeof loginSchema>;

export type SurveyType = z.infer<typeof surveySchema>;

export type SurveyStepThreeType = z.infer<typeof surveyStepThreeSchema>;

export type SurveyStepTwoType = z.infer<typeof surveyStepTwoSchema>;