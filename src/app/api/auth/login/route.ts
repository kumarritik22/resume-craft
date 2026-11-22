import { generateToken } from "@/lib/jwt";
import { connectToDB } from "@/lib/mongodb";
import userModel from "@/models/user.model";
import { ApiResponse } from "@/types/api.types";
import { LoginBody } from "@/types/user.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();

        const body: LoginBody = await req.json();

        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json<ApiResponse>({
                message: "All fields are required",
                success: false
            }, { status: 400 });
        };

        const isExisted = await userModel.findOne({ email });

        if (!isExisted) return NextResponse.json<ApiResponse>({
            message: "User not found",
            success: false
        }, { status: 404 });

        const matchPass = isExisted.comparePass(password);

        if (!matchPass) return NextResponse.json<ApiResponse>({
            message: "Invalid credentials",
            success: false
        }, { status: 401 });

        const token = generateToken({ userId: isExisted._id.toString() });

        const response = NextResponse.json<ApiResponse>({
            message: "User logged in successfully",
            success: true,
            data: {
                user: {
                    _id: isExisted._id,
                    name: isExisted.name,
                    email: isExisted.email
                }
            }
        }, { status: 200 });

        response.cookies.set("token", token, {
            httpOnly: true, 
            sameSite: "lax",
            maxAge: 60 * 60 * 1000
        });

        return response;

    } catch (error) {
        console.error("Error in login api", error);
        return NextResponse.json<ApiResponse>({
            message: "Something went wrong",
            success: false,
            error: { error }
        }, { status: 500 });
    }
};