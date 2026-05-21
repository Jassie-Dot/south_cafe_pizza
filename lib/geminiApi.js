const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

export function hasGeminiApiKey() {
  return Boolean(process.env.GEMINI_API_KEY);
}

export function extractGeminiText(data) {
  return (
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part?.text || "")
      .join("")
      .trim() || ""
  );
}

export async function generateGeminiContent({
  contents,
  systemInstruction,
  temperature = 0.5,
  maxOutputTokens = 800,
  responseMimeType,
  responseJsonSchema
}) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Gemini API key is not configured.");
  }

  const model = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
  const generationConfig = {
    temperature,
    maxOutputTokens
  };

  if (responseMimeType) {
    generationConfig.responseMimeType = responseMimeType;
  }

  if (responseJsonSchema) {
    generationConfig.responseJsonSchema = responseJsonSchema;
  }

  const response = await fetch(
    `${GEMINI_API_BASE_URL}/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemInstruction }]
        },
        contents,
        generationConfig
      })
    }
  );
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.error?.message || "Gemini could not answer right now.");
  }

  return data;
}
