import { getCurrentUser } from "@/lib/getCurrentUser";
import { connectToDB } from "@/lib/mongodb";
import userModel from "@/models/user.model";
import { ApiResponse } from "@/types/api.types";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDB();

        const userId = await getCurrentUser();

        const user = await userModel.findById(userId).select("-password");

        if (!user) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "User fetched successfully",
            data: { user }
        }, { status: 200 });

    } catch (error) {
        console.error("Error in get me api:", error);
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Unauthorized or invalid session"
        }, { status: 401 });
    }
};