# Project Clarifications

Here is a list of questions and clarifications needed before or during the implementation of Creatives Academy:

1. **Firebase Setup:** Do you already have a Firebase project set up with Firestore and Authentication enabled? If so, I will need you to provide the environment variables. If not, I can provide instructions on how to set it up.
2. **User Management:** The brief states the app is for a "single learner for now" but outlines a scalable `/users/{uid}` structure. Should I build a standard registration flow where anyone can register, or should we restrict registration (e.g., manual creation, or first-user-only)?
3. **Curriculum Population:** The brief includes an extensive 18-month curriculum. For the initial `data/curriculum.json`, should I transcribe the entire detailed Phase 0-5 structure immediately, or start with Phase 0 fully fleshed out and placeholder entries for the rest?
4. **AI Model Selection:** Which Gemini model would you prefer to use for the grading API: `gemini-1.5-pro` or the newer/faster `gemini-2.0-flash`?
5. **Phase 1 Priority:** Should we implement the `Mock Data` approach for the curriculum first to speed up frontend development, before integrating the live Firestore connection?