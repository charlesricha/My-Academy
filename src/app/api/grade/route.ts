import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { assignmentPrompt, expectedConcepts, userCode, userExplanation } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured on the server.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      Act as a strict but fair senior software engineering mentor.
      Grade the following student assignment submission.

      ASSIGNMENT PROMPT:
      ${assignmentPrompt}

      EXPECTED CONCEPTS TO BE COVERED:
      ${expectedConcepts ? expectedConcepts.join(", ") : "General programming principles"}

      STUDENT CODE:
      \`\`\`
      ${userCode}
      \`\`\`

      STUDENT EXPLANATION:
      ${userExplanation}

      GRADING CRITERIA:
      1. Correctness: Does the code solve the problem described in the prompt?
      2. Logic: Is the logic sound and efficient?
      3. Explanation Quality: Does the student demonstrate a deep understanding of what their code does?
      4. Code Clarity: Is the code well-structured, named appropriately, and easy to read?

      INSTRUCTIONS:
      - Be specific in feedback — tell the student exactly what they got wrong and why.
      - Do not give away the full answer — guide with hints if they need to resubmit.
      - Passing score is 70/100.
      - Return ONLY a valid JSON object with the following structure:
      {
        "score": number (0-100),
        "passed": boolean,
        "feedback": "detailed string",
        "improvements": ["string", "string"]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the text in case Gemini wraps it in markdown code blocks
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;
    
    let gradedResult;
    try {
      gradedResult = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON output. Raw text:", text);
      throw new Error("Failed to parse grading response from AI. Please try again.");
    }

    return NextResponse.json(gradedResult);
  } catch (error: any) {
    console.error("Gemini Grading Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to grade assignment" },
      { status: 500 }
    );
  }
}
