import { getCurrentUser } from "@/lib/getCurrentUser";
import { connectToDB } from "@/lib/mongodb";
import resumeModel from "@/models/resume.model";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();

        const userId = await getCurrentUser();

        const newResume = await resumeModel.create({
            user_id: userId,
            title: "",
            summary: "",
            personalInfo: {},
            workExperience: [],
            projects: [],
            education: [],
            certifications: [],
            skills: []
        });

        return NextResponse.json<ApiResponse>({
            message: "Resume created successfully",
            success: true,
            data: newResume
        }, { status: 201 });

    } catch (error) {
        console.error("Error in create resume api", error);
        return NextResponse.json<ApiResponse>({
            message: "Something went wrong",
            success: false
        }, { status: 500 });
    }
};