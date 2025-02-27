import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function getDoctorRecommendations(symptoms: string, userProfile: any) {
  try {
    const prompt = `
      Based on the following patient information and symptoms, recommend the most suitable doctors:
      
      Patient Profile:
      - Location: ${userProfile.location || 'Unknown'}
      - Age: ${userProfile.age || 'Unknown'}
      - Gender: ${userProfile.gender || 'Unknown'}
      - Preferred Therapy: ${userProfile.therapyType || userProfile.therapy_preference || 'allopathy'}
      ${userProfile.medical_history ? `- Medical History: ${userProfile.medical_history}` : ''}
      ${userProfile.allergies ? `- Allergies: ${userProfile.allergies}` : ''}
      ${userProfile.current_medications ? `- Current Medications: ${userProfile.current_medications}` : ''}
      
      Symptoms: ${symptoms}
      
      Please analyze the symptoms and patient profile to suggest appropriate medical specialists.
      Consider factors like specialty required, therapy type preference, and severity of symptoms.
      
      Format your response in a clear, helpful way with:
      1. A brief analysis of the symptoms
      2. Recommended medical specialties to consult
      3. Any urgent warnings if the symptoms suggest emergency care is needed
      4. General advice for the patient
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    return "I'm sorry, I couldn't process your symptoms at the moment. Please try again later or consult with a healthcare professional directly if you're experiencing concerning symptoms.";
  }
}

export async function getHealthTips(userProfile: any) {
  try {
    const prompt = `
      Based on the following patient profile, provide personalized health tips and recommendations:
      
      Patient Profile:
      - Age: ${userProfile.age || 'Unknown'}
      - Gender: ${userProfile.gender || 'Unknown'}
      - Weight: ${userProfile.weight || 'Unknown'} kg
      - Height: ${userProfile.height || 'Unknown'} cm
      - Preferred Therapy: ${userProfile.therapy_preference || 'allopathy'}
      ${userProfile.medical_history ? `- Medical History: ${userProfile.medical_history}` : ''}
      ${userProfile.allergies ? `- Allergies: ${userProfile.allergies}` : ''}
      
      Please provide:
      1. General wellness recommendations appropriate for this profile
      2. Dietary suggestions
      3. Exercise recommendations
      4. Preventive health screenings that might be appropriate
      5. Mental health and stress management tips
      
      Keep recommendations evidence-based and focused on overall wellness.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error getting health tips:', error);
    return "I'm sorry, I couldn't generate personalized health tips at the moment. Please try again later.";
  }
}