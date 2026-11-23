export interface GenerateSummaryBody {
    exprienceLevel: string;
    skills: string[];
    jobTitle: string;
};

export interface GenerateSkillsBody {
    exprienceLevel: string;
    jobTitle: string;
};

export interface GenerateProjectDescriptionBody {
    exprienceLevel: string;
    jobTitle: string;
    techStack: string[];
};