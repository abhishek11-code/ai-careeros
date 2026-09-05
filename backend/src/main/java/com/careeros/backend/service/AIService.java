package com.careeros.backend.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.stereotype.Service;

@Service
public class AIService {

    private final Client client;

    public AIService() {
        this.client = Client.builder()
                .apiKey(System.getenv("GEMINI_API_KEY"))
                .build();
    }

    public String generateRoadmap(
            String name,
            String targetRole,
            String skills,
            String degree,
            Integer graduationYear) {

        String prompt = """
                You are an expert AI career coach.

                Create a personalized career roadmap for the following student.

                Name: %s
                Degree: %s
                Graduation Year: %d
                Target Role: %s
                Current Skills: %s

                Analyze the student's current skills and target role.

                Create a practical roadmap that includes:
                1. Current skill assessment
                2. Skills they need to learn
                3. Learning phases in order
                4. Projects they should build
                5. Recommended tools and technologies
                6. Interview preparation
                7. Approximate timeline

                The roadmap should be realistic for a college student.

                Return ONLY valid JSON.
                Do not use markdown.
                Do not put the JSON inside ```.

                Use this structure:

                {
                  "targetRole": "...",
                  "currentLevel": "...",
                  "estimatedMonths": 0,
                  "summary": "...",
                  "phases": [
                    {
                      "phase": 1,
                      "title": "...",
                      "durationWeeks": 0,
                      "skills": [],
                      "projects": [],
                      "description": "..."
                    }
                  ]
                }
                """.formatted(
                name,
                degree,
                graduationYear,
                targetRole,
                skills
        );

        GenerateContentResponse response = client.models.generateContent(
                "gemini-3.6-flash",
                prompt,
                null
        );

        return response.text();
    }

    public String chat(
            String name,
            String targetRole,
            String skills,
            String degree,
            Integer graduationYear,
            String question) {

        String prompt = """
                You are the AI Career Assistant inside AI CareerOS.

                You are helping a college student with their career.

                Student Profile:
                Name: %s
                Degree: %s
                Graduation Year: %d
                Target Role: %s
                Current Skills: %s

                The student asks:

                %s

                Give a practical, accurate and personalized answer.

                Consider the student's target role and current skills
                when giving recommendations.

                Do not blindly recommend technologies that are irrelevant
                to the student's target role.

                Keep the response easy to understand and actionable.
                """.formatted(
                name,
                degree,
                graduationYear,
                targetRole,
                skills,
                question
        );

        GenerateContentResponse response = client.models.generateContent(
                "gemini-3.6-flash",
                prompt,
                null
        );

        return response.text();
    }
}