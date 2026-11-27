import { generateAiContent } from "@/lib/gemini";
import { GenerateExperienceDescriptionBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        const body: GenerateExperienceDescriptionBody = await req.json();

        const { experienceLevel, jobRole, techStack, yearsOfExperience } = body;

        if (!experienceLevel || !jobRole || !techStack || !yearsOfExperience) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "Missing fields"
            }, { status: 400 });
        }
        
        const prompt = `
            You are a senior resume writer, technical recruiter, and ATS optimization specialist.

            Generate a compelling, professional, and ATS-friendly work experience description using ALL the candidate details provided below.

            Candidate Details:
            Experience Level: ${experienceLevel}
            Years of Experience: ${yearsOfExperience}
            Job Role: ${jobRole}
            Tech Stack: ${techStack}

            Rules:
            1. Write 40-60 words in 2-3 impactful sentences.
            2. Explicitly incorporate the candidate's years of experience naturally into the description. Do not ignore or overlook this information.
            3. Use the experience level and years of experience together to establish the candidate's professional positioning and technical maturity.
            4. Highlight role-specific technical responsibilities, development capabilities, and engineering contributions appropriate to the candidate's experience.
            5. Naturally integrate the most relevant technologies from the provided tech stack, explaining their technical relevance rather than merely listing them.
            6. Emphasize technical ownership, problem-solving, application development, architecture, optimization, or collaboration where appropriate to the experience level.
            7. Use strong action verbs, precise technical language, and industry-standard ATS keywords.
            8. Ensure the description communicates the candidate's professional growth, technical capabilities, and value to potential employers.
            9. Avoid generic statements, clichés, repetitive phrases, and unnecessary adjectives.
            10. Never invent employers, projects, responsibilities, achievements, metrics, or business outcomes that were not provided.
            11. Do not exaggerate technical expertise, leadership responsibilities, or professional accomplishments.
            12. Ensure the description reads like authentic professional experience, not a checklist of technologies or generic job responsibilities.

            Output Requirements:
            - Return only the work experience description as plain text.
            - Do not include headings, bullet points, quotation marks, or explanations.
            - Maintain a confident, concise, and recruiter-friendly tone.
            - Strictly follow the 40-60-word limit.

            IMPORTANT:
            Every provided input must meaningfully influence the generated description. In particular, years of experience must be reflected explicitly and naturally, rather than being used only to determine the writing style.

            Generate a description that effectively communicates the candidate's professional experience, technical expertise, and suitability for the specified job role.
        `;

        const result = await generateAiContent(prompt);

        const workExperienceDescription = result;

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "Work experience description created successfully",
            data: { workExperienceDescription }
        }, { status: 201 });

    } catch (error) {
        console.error("Error in generate work experience description api", error);
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Something went wrong"
        }, { status: 500 });
    }
};