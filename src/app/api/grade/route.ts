import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp,
  doc,
  updateDoc
} from "firebase/firestore";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  let createdDocRef: any = null;
  let attemptNumber = 1;
  let uidVal: string | null = null;
  let moduleIdVal: string | null = null;

  try {
    const { assignmentPrompt, expectedConcepts, userCode, userExplanation, uid, moduleId } = await req.json();
    uidVal = uid;
    moduleIdVal = moduleId;

    // 1. Determine attempt number and record submission to Firestore BEFORE grading starts
    if (uid && moduleId) {
      try {
        const submissionsRef = collection(db, "submissions", uid, moduleId);
        const q = query(submissionsRef, orderBy("attemptNumber", "desc"), limit(1));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          attemptNumber = (querySnapshot.docs[0].data().attemptNumber || 0) + 1;
        }

        createdDocRef = await addDoc(submissionsRef, {
          score: 0,
          passed: false,
          feedback: "Grading in progress...",
          improvements: [],
          attemptNumber,
          timestamp: serverTimestamp(),
          userCode,
          userExplanation
        });
      } catch (dbError) {
        console.error("Firestore Initial Save Error:", dbError);
      }
    }

    // 2. Call Gemini API to grade the assignment
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

    // 3. Update the Firestore submission document with final grading results
    if (createdDocRef) {
      try {
        await updateDoc(createdDocRef, {
          score: gradedResult.score,
          passed: gradedResult.passed,
          feedback: gradedResult.feedback,
          improvements: gradedResult.improvements,
        });
        gradedResult.attemptNumber = attemptNumber;
      } catch (dbUpdateError) {
        console.error("Firestore Final Update Error:", dbUpdateError);
      }
    }

    return NextResponse.json(gradedResult);
  } catch (error: any) {
    console.error("Gemini Grading Error:", error);

    const errorMessage = error.message || "Failed to grade assignment";
    const fallbackFeedback = `Submission recorded successfully, but automatic grading failed: ${errorMessage}. Please check your API quota or retry.`;

    // 4. Update the Firestore submission document with the failure feedback
    if (createdDocRef) {
      try {
        await updateDoc(createdDocRef, {
          score: 0,
          passed: false,
          feedback: fallbackFeedback,
          improvements: ["Verify your Gemini API key and connection.", "Retry grading your submission."],
        });
      } catch (dbUpdateError) {
        console.error("Firestore Failure Update Error:", dbUpdateError);
      }
    }

    // Return a 200 response with passed: false, so it doesn't crash the client, but records it as failed and shows the error
    return NextResponse.json({
      score: 0,
      passed: false,
      feedback: fallbackFeedback,
      improvements: ["Verify your Gemini API key and connection.", "Retry grading your submission."],
      attemptNumber,
      gradingError: true
    });
  }
}
