import Groq from "groq-sdk";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function validateIdea(idea: {
  title: string;
  description: string;
  problem: string;
  solution: string;
  targetMarket: string;
  stage: string;
}) {
  const prompt = `You are an expert startup advisor. Analyze this startup idea and provide structured feedback.

Startup Idea:
Title: ${idea.title}
Description: ${idea.description}
Problem: ${idea.problem}
Solution: ${idea.solution}
Target Market: ${idea.targetMarket}
Stage: ${idea.stage}

Respond ONLY with a valid JSON object in exactly this format, no other text:
{
  "validationScore": <number between 0 and 100>,
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 1000,
  });

  const content = response.choices[0]?.message?.content || "";

  try {
    const cleaned = content.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    throw new Error("Failed to parse AI response");
  }
}