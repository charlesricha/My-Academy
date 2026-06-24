import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from "firebase/firestore";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { assignmentPrompt, expectedConcepts, userCode, userExplanation, uid, moduleId } = await req.json();

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

    // Save to Firestore if uid and moduleId are provided
    if (uid && moduleId) {
      try {
        const submissionsRef = collection(db, "submissions", uid, moduleId);
        const q = query(submissionsRef, orderBy("attemptNumber", "desc"), limit(1));
        const querySnapshot = await getDocs(q);
        
        let attemptNumber = 1;
        if (!querySnapshot.empty) {
          attemptNumber = (querySnapshot.docs[0].data().attemptNumber || 0) + 1;
        }

        await addDoc(submissionsRef, {
          score: gradedResult.score,
          passed: gradedResult.passed,
          feedback: gradedResult.feedback,
          improvements: gradedResult.improvements,
          attemptNumber,
          timestamp: serverTimestamp(),
          userCode,
          userExplanation
        });

        gradedResult.attemptNumber = attemptNumber;
      } catch (dbError) {
        console.error("Firestore Save Error:", dbError);
        // We still return the grade even if saving fails, but log the error
      }
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
