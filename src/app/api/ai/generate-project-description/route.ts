import { generateAiContent } from "@/lib/gemini";
import { GenerateProjectDescriptionBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        const body: GenerateProjectDescriptionBody = await req.json();

        const { exprienceLevel, jobTitle, techStack, projectTitle, projectFeatures } = body;

        if (!exprienceLevel || !jobTitle || !techStack || !projectTitle || !projectFeatures) {
            return NextResponse.json<ApiResponse>({
                message: "Missing fields",
                success: false
            }, { status: 400 });
        } 
        
        
        const prompt = `
            You are an expert resume writer and ATS optimization specialist specializing in technical resumes.

            Generate a professional, impactful, and ATS-friendly project description using the following details:

            Experience Level: ${exprienceLevel}
            Target Job Title: ${jobTitle}
            Project Title: ${projectTitle}
            Project Features: ${projectFeatures}
            Tech Stack: ${techStack}

            Rules:
            1. Write a description of 40-60 words in 2-3 well-structured sentences.
            2. Clearly communicate the project's purpose, core functionality, and technical implementation.
            3. Naturally incorporate relevant technologies from the provided tech stack.
            4. Highlight the most important features and technical concepts rather than simply listing them.
            5. Align the technical depth, language, and level of responsibility with the candidate's experience level and target job role.
            6. Use strong action verbs and industry-standard technical terminology.
            7. Prioritize clarity, technical relevance, and ATS-friendly keywords over unnecessary complexity.
            8. Do not invent features, technologies, responsibilities, achievements, metrics, or business outcomes.
            9. Avoid generic statements, repetitive phrases, exaggerated claims, and keyword stuffing.
            10. Do not simply repeat the project title, tech stack, or features as a list. Convert the information into a cohesive professional description.
            11. Identify and prioritize the project's primary purpose and overall value rather than treating individual features as separate objectives.
            12. Present supporting features as capabilities that contribute to the project's main purpose. Do not let individual AI functionalities overshadow the core application.
            13. For an ATS-friendly resume builder, emphasize helping users create, customize, and manage professional, ATS-friendly resumes. Describe AI-powered summary, skills, and project description generation as supporting capabilities.
            14. Ensure the opening sentence communicates what the project does, followed by its key technical implementations and features.

            Return only the project description as plain text, without headings, bullet points, quotation marks, or explanations.
        `;

        const result = await generateAiContent(prompt);

        const projectDescription = result;

        return NextResponse.json<ApiResponse>({
            message: "Project description created successfully",
            success: true,
            data: { projectDescription }
        }, { status: 201 });

    } catch (error) {
        console.error("Error in generate project description api", error);
        return NextResponse.json<ApiResponse>({
            message: "Something went wrong",
            success: false
        }, { status: 500 });
    }
};