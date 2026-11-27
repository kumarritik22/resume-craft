import { getCurrentUser } from "@/lib/getCurrentUser";
import { connectToDB } from "@/lib/mongodb";
import resumeModel from "@/models/resume.model";
import { ApiResponse } from "@/types/api.types";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDB();

        const userId = await getCurrentUser();

        const listAllResumes = await resumeModel
        .find({ user_id: userId })
        .sort({ updatedAt: -1 });

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "All resumes fetched successfully",
            data: { listAllResumes }
        }, { status: 200 });

    } catch (error) {
        console.error("Error in get all resumes api:", error);
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Unauthorized or invalid access",
            error: { error }
        }, { status: 401 });
    }
};