import { generateAiContent } from "@/lib/gemini";
import { ImproveContentBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        const body: ImproveContentBody = await req.json();

        const { content } = body;

        if (!content) {
            return NextResponse.json<ApiResponse>({
                message: "Missing fields",
                success: false
            }, { status: 400 });
        }
            
        const prompt = `
            You are a senior resume writer, professional career consultant, and ATS optimization specialist.

            Your task is to transform the provided resume content into a polished, impactful, professional, and ATS-friendly version while preserving its original meaning and factual accuracy.

            Resume Content:
            ${content}

            Rules:
            1. Carefully understand the provided content and identify its context before improving it.
            2. Preserve the original meaning, intent, and all factual information.
            3. Improve grammar, sentence structure, clarity, readability, and professional tone.
            4. Use strong action verbs, precise language, and industry-standard terminology wherever appropriate.
            5. Optimize the content for ATS by naturally incorporating relevant technical and industry keywords already supported by the provided information.
            6. Make the content concise, impactful, and easy for recruiters to understand.
            7. Remove unnecessary words, vague statements, repetition, clichés, and generic expressions.
            8. Preserve important technical details, numbers, metrics, achievements, technologies, and responsibilities.
            9. Do not fabricate experience, achievements, qualifications, skills, technologies, metrics, or responsibilities.
            10. Do not introduce unsupported keywords or claims merely to improve ATS compatibility.
            11. Maintain the appropriate format based on the content:
                - Paragraphs should remain well-structured paragraphs.
                - Bullet points should remain concise and impactful bullet points.
                - Skills should remain clear, relevant skill entries.
            12. Do not unnecessarily change content that is already professionally written. Make meaningful improvements rather than rewriting for the sake of rewriting.
            13. Ensure the final content sounds natural, authentic, confident, and recruiter-friendly.

            Output Requirements:
            - Return only the improved resume content.
            - Do not include headings, introductory statements, explanations, or feedback.
            - Do not mention the changes you made.
            - Do not wrap the response in quotation marks or Markdown code fences.
            - Preserve the original content's format wherever possible.

            Generate the best possible version of the provided resume content while maintaining complete factual accuracy and ATS compatibility.
        `;

        const result = await generateAiContent(prompt);

        const improvedContent = result;

        return NextResponse.json<ApiResponse>({
            message: "Improved content generated successfully",
            success: true,
            data: { improvedContent }
        }, { status: 201 });

    } catch (error) {
        console.error("Error in improve content api", error);
        return NextResponse.json<ApiResponse>({
            message: "Something went wrong",
            success: false
        }, { status: 500 });
    }
};