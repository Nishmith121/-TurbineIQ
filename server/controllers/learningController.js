const { GoogleGenerativeAI } = require("@google/generative-ai");

// Helper to get Gemini response
const askGemini = async (prompt) => {
  // We need to use the API key from environment variables
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is not configured.");
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

// @desc    Ask a question about a machine
// @route   POST /api/learning/ask
// @access  Private
const askQuestion = async (req, res) => {
  try {
    const { machineId, question } = req.body;
    
    if (!question) {
      return res.status(400).json({ success: false, error: "Please provide a question." });
    }

    // Contextualize the prompt for the AI so it behaves like an engineering tutor
    const prompt = `You are an expert engineering tutor helping a student build a project about a ${machineId.replace('_', ' ')}. 
    The student is asking: "${question}"
    
    Provide a clear, brief, and educational answer. Keep it under 3 paragraphs. Use simple formatting.`;

    const answer = await askGemini(prompt);

    res.status(200).json({
      success: true,
      answer: answer
    });

  } catch (error) {
    console.error("Gemini API Error:", error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message || "Failed to get an answer from the AI." 
    });
  }
};

module.exports = {
  askQuestion
};
