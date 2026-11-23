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
    projectTitle: string;
    projectFeatures: string[];
    techStack: string[];
};

export interface GenerateExperienceDescriptionBody {
    exprienceLevel: string;
    jobRole: string;
    yearsOfExperience: number;
    techStack: string[];
};