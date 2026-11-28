import { getCurrentUser } from "@/lib/getCurrentUser";
import { connectToDB } from "@/lib/mongodb";
import resumeModel from "@/models/resume.model";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function GET({ params }: { params: Promise<{ resumeId: string }> }) {
    try {
        await connectToDB();

        const userId = await getCurrentUser();

        const { resumeId } = await params;

        const resume = await resumeModel.findOne({
            _id: resumeId,
            user_id: userId
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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ resumeId: string }> }) {
    try {
        await connectToDB();

        const userId = await getCurrentUser();

        const body = await req.json();

        const { resumeId } = await params;

        const updatedResume = await resumeModel.findOneAndUpdate(
            {
                _id: resumeId,
                user_id: userId
            },
            {
                $set: body
            },
            {
                new: true,
                runValidators: true
            }
        );
        
        if (!updatedResume) return NextResponse.json<ApiResponse>({
            success: false,
            message: "Failed to update resume"
        }, { status: 400 });

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "Resume updated successfully",
            data: { updatedResume }
        }, { status: 200 });

    } catch (error) {
        console.error("Error in update resume api:", error);
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Something went wrong"
        }, { status: 500 });
    }
};

export async function DELETE({params}: { params: Promise<{ resumeId: string }> }) {
    try {
        await connectToDB();

        const userId = await getCurrentUser();

        const { resumeId } = await params;

        const deleteResume = await resumeModel.findOneAndDelete({
            _id: resumeId,
            user_id: userId
        });

        if (!deleteResume) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "Resume not found"
            }, { status: 404 });
        }

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "Resume deleted successfully",
            data: { deleteResume }
        });

    } catch (error) {
        console.error("Error in delete resume api:", error);
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Something went wrong"
        }, { status: 500 });
    }
};