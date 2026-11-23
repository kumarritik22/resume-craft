import { generateAiContent } from "@/lib/gemini";
import { GenerateSummaryBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        const body: GenerateSummaryBody = await req.json();

        const { experienceLevel, jobTitle, skills } = body;

        if (!experienceLevel || !jobTitle || !skills) {
            return NextResponse.json<ApiResponse>({
                message: "Missing fields",
                success: false
            }, { status: 400 });
        } 
        
        const prompt = `
            You are a senior resume writer, technical recruiter, and ATS optimization specialist with expertise in creating impactful professional resume summaries.

            Your task is to generate a compelling, professional, and ATS-friendly resume summary using the candidate details provided below.

            Candidate Details:
            Job Title: ${jobTitle}
            Technical Skills: ${skills}
            Experience Level: ${experienceLevel}

            Rules and Guidelines:

            1. Write a resume summary between 50 and 100 words.

            2. Make the experience level the primary factor when determining the summary's tone, positioning, technical depth, and emphasis. The summary must accurately reflect the candidate's career stage.

            3. Adapt the summary according to the experience level:
            - Fresher / Entry-Level: Emphasize foundational technical knowledge, relevant technologies, programming capabilities, and readiness to apply skills in real-world development environments. Do not portray the candidate as an experienced professional.
            - Junior-Level: Highlight practical technical capabilities, familiarity with relevant technologies, and ability to contribute to development tasks and projects.
            - Mid-Level: Emphasize established technical expertise, independent problem-solving, application development capabilities, and experience with relevant development practices.
            - Senior-Level: Focus on advanced technical expertise, system architecture, technical decision-making, scalability, performance optimization, and technical leadership where relevant.

            4. Align the summary closely with the specified job title and prioritize the technical skills most relevant to that role.

            5. Naturally incorporate important industry-specific and ATS-friendly keywords from the provided technical skills. Avoid keyword stuffing or listing skills unnaturally.

            6. Communicate the candidate's technical strengths, professional value, and relevance to the target role rather than simply repeating the provided skills.

            7. Begin with a strong professional positioning statement that clearly establishes the candidate's role and experience level.

            8. Use impactful, precise, and industry-relevant language. Maintain a confident, professional, and recruiter-friendly tone.

            9. Do not use generic phrases, clichés, unnecessary adjectives, vague claims, or repetitive statements.

            10. Never fabricate years of experience, previous employment, projects, achievements, certifications, educational qualifications, or measurable results that have not been provided.

            11. Do not exaggerate the candidate's expertise or describe the candidate as an expert, specialist, or leader unless supported by the provided information and experience level.

            12. Use clear, concise, grammatically correct language. Write in an implied first-person resume style without using personal pronouns such as "I", "My", "He", or "She".

            13. Avoid mentioning the experience level as a label unless it naturally improves the summary.

            14. Ensure the summary reads as a cohesive professional paragraph, not a checklist of skills.

            Output Requirements:
            - Return only the resume summary text.
            - Do not include a heading, title, bullet points, or explanations.
            - Do not include quotation marks or Markdown formatting.
            - Strictly maintain the 50 to 100-word limit.

            Generate a distinctive, impactful, and ATS-friendly resume summary that accurately reflects the candidate's experience level and technical profile.
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