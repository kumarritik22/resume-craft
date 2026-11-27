import { generateAiContent } from "@/lib/gemini";
import { ATSScoreBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        const body: ATSScoreBody = await req.json();

        const { resumeText } = body;

        if (!resumeText) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "Missing fields"
            }, { status: 400 });
        } 
        
        const prompt = `
            You are an expert ATS evaluator, technical recruiter, and professional resume consultant.

            Analyze the following resume and calculate its ATS compatibility score out of 100.

            Resume Content:
            ${resumeText}

            Evaluation Criteria:

            1. ATS Readability and Structure (20 points):
            Evaluate section organization, headings, formatting consistency visible in the extracted text, and overall readability by ATS software.

            2. Resume Completeness (15 points):
            Evaluate relevant sections such as professional summary, skills, work experience, projects, education, and certifications where applicable.

            3. Skills and Keyword Optimization (15 points):
            Evaluate the relevance, specificity, and natural usage of technical and industry-related keywords. Penalize keyword stuffing and irrelevant skills.

            4. Experience and Project Descriptions (20 points):
            Evaluate the quality of responsibilities, technical contributions, project descriptions, and relevance to the candidate's professional profile.

            5. Achievements and Measurable Impact (15 points):
            Evaluate the presence of meaningful accomplishments, quantified results, and evidence of professional or project contributions.

            6. Language and Professional Quality (10 points):
            Evaluate grammar, clarity, sentence structure, professional tone, and conciseness.

            7. Consistency and Accuracy (5 points):
            Evaluate consistency in terminology, dates, job titles, and overall presentation of information.

            Scoring Rules:
            1. Assign a fair score based on the actual content provided.
            2. Calculate the final score by adding all category scores. The maximum must be 100.
            3. Do not award high scores simply because the resume contains many keywords.
            4. Do not penalize freshers excessively for lacking professional work experience. Consider relevant projects, internships, education, and practical contributions.
            5. Do not assume missing information or invent achievements, qualifications, or experience.
            6. Identify specific weaknesses and provide practical, actionable recommendations.
            7. Evaluate general ATS compatibility only. Do not claim job-specific matching because no job description is provided.
            8. Since only extracted resume text is available, do not make unsupported claims about visual layout, fonts, colors, or graphical elements.

            Rating Guidelines:
            - 90-100: Excellent
            - 75-89: Very Good
            - 60-74: Good
            - 40-59: Needs Improvement
            - 0-39: Poor

            Output Requirements:
            Return only a valid JSON object using the following structure:

            {
                "score": 85,
                "rating": "Very Good",
                "breakdown": {
                    "atsReadability": 18,
                    "resumeCompleteness": 13,
                    "skillsAndKeywords": 13,
                    "experienceAndProjects": 17,
                    "achievementsAndImpact": 12,
                    "languageAndProfessionalQuality": 8,
                    "consistencyAndAccuracy": 4
                },
                "strengths": [
                    "Clearly structured professional experience",
                    "Relevant technical skills and keywords"
                ],
                "improvements": [
                    "Add measurable achievements to demonstrate professional impact",
                    "Improve project descriptions with specific technical contributions"
                ]
            }

            Ensure:
            - The score and breakdown values are numbers, not strings.
            - The sum of all breakdown scores equals the final score.
            - Strengths and improvements contain specific, resume-related observations.
            - Return 3 to 5 strengths and 3 to 5 improvements where sufficient evidence exists.
            - Do not include Markdown code fences, introductory text, or explanations.
            - Return raw, valid JSON that can be parsed directly using JSON.parse().

            Evaluate the resume objectively and return the final assessment.
        `;

        const result = await generateAiContent(prompt);

        let atsScore = result;

        if (typeof atsScore === "string") {
            try {
                const cleaned = atsScore.replace(/```json|```/g, "").trim();
                atsScore = JSON.parse(cleaned);
            } catch (error) {
                console.error("Failed to parse ATS score:", error);
            }
        }

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "ATS score generated successfully",
            data: { atsScore }
        }, { status: 201 });

    } catch (error) {
        console.error("Error in ATS Score api", error);
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Something went wrong"
        }, { status: 500 });
    }
};