import { generateAiContent } from "@/lib/gemini";
import { GenerateSkillsBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        const body: GenerateSkillsBody = await req.json();

        const { exprienceLevel, jobTitle } = body;

        if (!exprienceLevel || !jobTitle) {
            return NextResponse.json<ApiResponse>({
                message: "Missing fields",
                success: false
            }, { status: 400 });
        }
            
        const prompt = `
            You are a senior technical recruiter, resume writer, and ATS optimization specialist with deep knowledge of industry-specific technical skills and hiring requirements.

            Your task is to generate a highly relevant, ATS-optimized technical skills list based on the candidate's target job role and experience level.

            Candidate Details:
            Job Title: ${jobTitle}
            Experience Level: ${exprienceLevel}

            Instructions and Rules:

            1. Generate 12 to 18 relevant technical skills that align with the specified job title and experience level.

            2. Include ONLY technical skills, such as:
            - Programming languages
            - Frameworks and libraries
            - Databases and database technologies
            - Developer tools and platforms
            - Cloud platforms and services
            - APIs and integrations
            - Development methodologies and technical concepts
            - Testing and deployment technologies
            - Relevant technical architectures and technologies

            3. Strictly exclude soft skills, personality traits, interpersonal abilities, and generic professional qualities such as communication, leadership, teamwork, creativity, and problem-solving.

            4. Prioritize skills that are:
            - Directly relevant to the specified job title.
            - Commonly required in current industry job descriptions.
            - Frequently recognized by Applicant Tracking Systems (ATS).
            - Important for performing the technical responsibilities of the role.

            5. Adjust the complexity and selection of skills according to the experience level:
            - Fresher / Entry-Level: Focus on foundational programming languages, core technologies, commonly used frameworks, development tools, and essential technical concepts.
            - Junior-Level: Include foundational skills along with practical development technologies, commonly used libraries, databases, APIs, and development workflows.
            - Mid-Level: Include advanced frameworks, system design fundamentals, architecture concepts, performance optimization, testing, deployment, and relevant infrastructure technologies.
            - Senior-Level: Emphasize advanced technical expertise, system architecture, scalability, cloud infrastructure, distributed systems, security, performance engineering, and other role-specific advanced technologies.

            6. Maintain a balanced selection of core technologies and complementary technical skills without including unrelated technologies merely to increase the skill count.

            7. Use standard industry-recognized names and terminology. For example, use "React.js" instead of vague terms such as "Frontend Technology."

            8. Avoid duplicate skills, overlapping terms, outdated technologies, generic categories, and unnecessary variations of the same skill.

            9. Do not include technologies that are unrelated to the specified job role or inappropriate for the candidate's experience level.

            10. Do not generate proficiency levels, ratings, descriptions, explanations, or skill categories.

            11. Do not fabricate candidate-specific experience or claim that the candidate has mastered any technology. Generate role-relevant skills as suggestions for the candidate's resume.

            12. Ensure every generated item is an individual, concise technical skill rather than a sentence or descriptive phrase.

            CRITICAL OUTPUT REQUIREMENTS:
            1. Return a RAW JSON ARRAY of strings.
            2. The output must start with [ and end with ].
            3. Every skill must be a separate string inside the array.
            4. Do NOT return the array as a string.
            5. Do NOT wrap the array inside an object such as {"skills": [...]}.
            6. Do NOT escape quotation marks or convert the array into a string.
            7. Do NOT use Markdown code fences.
            8. Do NOT include any text before or after the JSON array.
            9. Ensure the output is valid JSON and can be directly parsed using JSON.parse().

            Expected output format:
            [
                "JavaScript",
                "TypeScript",
                "React.js",
                "Node.js",
                "MongoDB"
            ]

            Return only the raw JSON array.
        `;

        const result = await generateAiContent(prompt);

        let skills = result;

        if (typeof skills === "string") {
            try {
                skills = JSON.parse(skills);
            } catch (error) {
                console.error("Failed to parse skills:", error)
            }
        }

        return NextResponse.json<ApiResponse>({
            message: "Skills created successfully",
            success: true,
            data: { skills }
        }, { status: 201 });

    } catch (error) {
        console.error("Error in generate skills api", error);
        return NextResponse.json<ApiResponse>({
            message: "Something went wrong",
            success: false
        }, { status: 500 });
    }
};