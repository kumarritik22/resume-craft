import { ApiResponse } from "@/types/api.types";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const response = NextResponse.json<ApiResponse>({
            success: true,
            message: "User logged out successfully"
        }, { status: 200 });

        response.cookies.delete("token");

        return response;

    } catch (error) {
        console.error("Error in logout api:", error);
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Something went wrong"
        }, { status: 500 });
    }
};