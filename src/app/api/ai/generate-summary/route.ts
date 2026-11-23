import { generateAiContent } from "@/lib/gemini";
import { connectToDB } from "@/lib/mongodb";
import { GenerateSummaryBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        const body: GenerateSummaryBody = await req.json();

        const { exprienceLevel, jobTitle, skills } = body;

        if (!exprienceLevel || !jobTitle || !skills) {
            return NextResponse.json<ApiResponse>({
                message: "Missing fields",
                success: false
            }, { status: 400 });
        }
            
        
        const prompt = `
            You are an expert resume writer and ATS optimization specialist.

            Generate a professional, ATS-friendly resume summary based on the following details:

            Job Title: ${jobTitle}
            Skills: ${skills}
            Experience Level: ${exprienceLevel}

            Rules:
            1. Write between 50 and 100 words.
            2. Use a professional, concise, and confident tone.
            3. Naturally incorporate relevant keywords from the job title and skills to improve ATS compatibility.
            4. Highlight the candidate's relevant technical skills, strengths, and expertise.
            5. Align the summary with the specified experience level.
            6. Focus on industry-relevant skills and value the candidate can bring to an organization.
            7. Avoid generic statements, unnecessary adjectives, clichés, and repetitive phrases.
            8. Do not invent work experience, achievements, certifications, or qualifications that are not provided.
            9. Use clear, simple language and write in the third person or implied first person (without using "I" or "My").
            10. Do not include headings, bullet points, or explanations.

            Return only the resume summary text.
        `;

        const result = await generateAiContent(prompt);

        const summary = result;

        return NextResponse.json<ApiResponse>({
            message: "Resume summary created successfully",
            success: true,
            data: { summary }
        }, { status: 201 });

    } catch (error) {
        console.error("Error in generate summary api", error);
        return NextResponse.json<ApiResponse>({
            message: "Something went wrong",
            success: false
        }, { status: 500 });
    }
};