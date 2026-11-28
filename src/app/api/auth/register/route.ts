import { generateToken } from "@/lib/jwt";
import { connectToDB } from "@/lib/mongodb";
import userModel from "@/models/user.model";
import { ApiResponse } from "@/types/api.types";
import { RegisterBody } from "@/types/user.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();

        const body: RegisterBody = await req.json();
        const { name, email, mobile, password } = body

        if (!name || !email || !password) {
            return NextResponse.json<ApiResponse>({
                message: "All fields are required",
                success: false
            }, { status: 400 })
        }

        const isExisted = await userModel.findOne({ email });

        if (isExisted) return NextResponse.json<ApiResponse>({
            success: false,
            message: "User already exists"
        }, { status: 409 });

        const newUser = await userModel.create({ 
            name, email, mobile, password
        });

        const token = generateToken({ userId: newUser._id.toString() });

        const response = NextResponse.json<ApiResponse>({
            success: true,
            message: "User registered successfully",
            data: {
                user: {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email
                }
            }
        }, { status: 201 });

        response.cookies.set("token", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60
        });

        return response;

    } catch (error) {
        console.error("Error in register api", error);
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Something went wrong"
        }, { status: 500 });
    }
};