import { getCurrentUser } from "@/lib/getCurrentUser";
import { connectToDB } from "@/lib/mongodb";
import resumeModel from "@/models/resume.model";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ resumeId: string }> }) {
    try {
        await connectToDB();

        const user = await getCurrentUser();

        const { resumeId } = await params;

        const resume = await resumeModel.findOne({
            _id: resumeId,
            user_id: user.userId
        });

        if (!resume) return NextResponse.json<ApiResponse>({
            success: false,
            message: "Resume not found"
        }, { status: 404 });

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "Resume fetched successfully",
            data: { resume }
        }, { status: 200 });

    } catch (error) {
        console.error("Error in get resume api:", error);
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Something went wrong"
        }, { status: 500 });
    }
};

