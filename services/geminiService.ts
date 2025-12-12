import { GoogleGenAI, Type } from "@google/genai";
import { PostTone, ContentStrategy, Notification } from "../types";

// Ensure API Key is available
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

/**
 * Generates a LinkedIn draft based on one or more work activities.
 */
export const generateDraftFromActivity = async (
  activities: string[],
  tone: PostTone,
  strategy: ContentStrategy = ContentStrategy.STANDARD_UPDATE
): Promise<{ title: string; content: string }> => {
  if (!apiKey) {
    return {
      title: "API Key Missing",
      content: "Please configure your Gemini API key to generate content."
    };
  }

  const isBatch = activities.length > 1;
  const activityText = activities.map(a => `- ${a}`).join('\n');

  let strategyPrompt = "";
  if (strategy === ContentStrategy.BUILD_IN_PUBLIC) {
    strategyPrompt = `
      MODE: BUILD IN PUBLIC (Journey & Engagement Focus)
      - **Objective**: Create a raw, authentic "Building in Public" narrative. Focus on the journey, lessons learned, and community engagement, distinct from a standard feature announcement.
      - **Core Philosophy**: Share the "messy middle" of building. The audience values the struggle and the lesson more than the success. Prioritize storytelling and vulnerability.
      - **Mandatory Content Elements**:
        1. **The Why**: Briefly explain the context. Why were you working on this?
        2. **The Struggle**: You MUST describe a specific challenge, mistake, false start, or moment of doubt encountered. Do not gloss over the hard parts.
        3. **The Lesson**: What did you learn? What is the universal takeaway for other builders?
      - **Engagement**: The post MUST end with a specific, open-ended question designed to spark a debate or sharing of war stories (e.g., "Have you ever dealt with X?", "How do you handle Y?").
      - **Structure**: Hook (The Struggle/Insight) -> The Narrative (The "Bad" & The "Good") -> The Lesson -> Community Question.
    `;
  } else {
    strategyPrompt = `
      MODE: STANDARD UPDATE (Feature & Value Focus)
      - **Core Philosophy**: Announce a new capability and its immediate value to the user.
      - **Content Requirements**: 
        - Clearly state what is new.
        - Explain the benefit (time saved, money made, frustration avoided).
        - Include a Call to Action (Try it out, Link in comments).
      - **Structure**: Announcement -> The Problem Solved -> The Solution -> Call to Action.
    `;
  }

  let tonePrompt = "";
  switch (tone) {
    case PostTone.CONTRARIAN:
      tonePrompt = `
        STYLE: CONTRARIAN / PROVOCATIVE
        - Challenge common industry wisdom or "best practices".
        - Be bold, opinionated, and slightly polarizing.
        - Use short, punchy sentences.
        - Start with a statement that makes people stop scrolling (e.g., "Stop doing X", "Why everyone is wrong about Y").
      `;
      break;
    case PostTone.DATA_FOCUSED:
      tonePrompt = `
        STYLE: DATA-FOCUSED / ANALYTICAL
        - Focus on metrics, efficiency, and quantifiable results.
        - Use numbers, percentages, and logic.
        - Avoid fluff and emotional storytelling; stick to the facts and the impact.
        - Tone should be objective, sharp, and expert.
      `;
      break;
    case PostTone.HUMBLE_BUILDER:
      tonePrompt = `
        STYLE: HUMBLE BUILDER
        - Tone: Highly conversational, vulnerable, and reflective. Use first-person ("I", "We"). 
        - Avoid all corporate jargon and marketing speak.
        - Emphasize learning and growth over expertise.
        - Use lowercase for emphasis if it fits the "indie hacker" vibe.
      `;
      break;
    case PostTone.PROFESSIONAL:
    default:
      tonePrompt = `
        STYLE: PROFESSIONAL / CORPORATE
        - Tone: Confident, energetic, and polished.
        - Suitable for a company page or a formal personal brand.
        - Clear, grammatically perfect, and value-oriented.
      `;
      break;
  }

  const prompt = `
    You are a ghostwriter for a technical founder building in public.
    Task: Turn these work logs into an engaging LinkedIn post.
    
    Activities:
    ${activityText}
    
    ${strategyPrompt}
    
    ${tonePrompt}
    
    Requirements:
    - ${isBatch ? 'This is a summary/update post combining multiple items.' : 'Focus deeply on this single achievement.'}
    - Hook the reader in the first line.
    - Keep paragraphs short (1-2 sentences).
    - Do not use hashtags.
    - Return JSON with 'title' (short internal summary, max 5 words) and 'content' (the post body).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING }
          },
          required: ["title", "content"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating draft:", error);
    return {
      title: "Generation Failed",
      content: `Failed to generate draft. Error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Detects industry trends and generates notifications/suggestions.
 */
export const detectIndustryTrends = async (industry: string = "SaaS"): Promise<Notification[]> => {
  if (!apiKey) return [];

  const prompt = `
    Analyze real-time search data to identify 2 significant industry trends, viral influencer discussions, or common "content gaps" (questions people are asking but not getting good answers to) in the ${industry} space right now.
    
    Focus on topics that would trigger engagement for a "Building in Public" founder.
    
    Return a valid JSON array of objects. Do not include markdown formatting. Each object must have:
    - 'title': Short catchy title of the trend (e.g. "The No-Code Debate", "AI Fatigue").
    - 'message': A 1-sentence explanation of why the user should post about this (e.g. "Influencers are debating X, add your perspective on Y").
    - 'actionQuery': A prompt string that can be used to generate a post about this.
    - 'type': 'trend' (for viral topics) or 'gap' (for unanswered questions).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Flash is sufficient for this
      contents: prompt,
      config: {
        // responseMimeType and responseSchema cannot be used with tools in the current API version
        tools: [{ googleSearch: {} }] // Use search to get real trends
      }
    });

    const text = response.text || "[]";
    const cleanJson = text.replace(/```json|```/g, '').trim();
    
    let rawItems = [];
    try {
        rawItems = JSON.parse(cleanJson);
    } catch (e) {
        console.error("Failed to parse JSON trend data", e);
        return [];
    }

    if (!Array.isArray(rawItems)) return [];

    return rawItems.map((item: any, idx: number) => ({
      id: `notif-${Date.now()}-${idx}`,
      title: item.title,
      message: item.message,
      type: item.type === 'gap' ? 'gap' : 'trend',
      timestamp: new Date(),
      actionQuery: item.actionQuery
    }));

  } catch (e) {
    console.error("Trend detection failed", e);
    return [];
  }
};

/**
 * Enhances/Rewrites existing text based on a specific tone or instruction.
 */
export const enhanceText = async (currentText: string, instruction: string): Promise<string> => {
  if (!apiKey) return currentText;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // Using Pro for better reasoning on style
      contents: `Rewrite the following text. Instruction: ${instruction}. \n\nOriginal Text:\n${currentText}`,
    });
    return response.text || currentText;
  } catch (e) {
    console.error("Enhance failed", e);
    return currentText;
  }
};

/**
 * Generates an image for the post using Gemini 3 Pro Image Preview.
 */
export const generatePostImage = async (prompt: string, size: "1K" | "2K" | "4K" = "1K"): Promise<string | null> => {
  if (!apiKey) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9", // LinkedIn post standard
          imageSize: size
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (e) {
    console.error("Image generation failed", e);
    return null;
  }
};

/**
 * Searches for industry news to generate a "Trend" post.
 */
export const findTrendsAndGenerateDraft = async (query: string): Promise<{ title: string; content: string; url?: string }> => {
  if (!apiKey) return { title: "No API Key", content: "Please set API Key" };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Write a LinkedIn post about this topic: "${query}".
      Return JSON with 'title', 'content', and 'url' if a source is found.`,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });
    
    // Parse response manually since schema isn't supported with tools
    const text = response.text || "{}";
    const cleanJson = text.replace(/```json|```/g, '').trim();
    
    try {
        const parsed = JSON.parse(cleanJson);
        const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        let url = "";
        if (grounding && grounding.length > 0) {
            url = grounding.find((c: any) => c.web?.uri)?.web?.uri || "";
        }
        
        return {
            title: parsed.title || "Industry Insight",
            content: parsed.content || text,
            url: parsed.url || url
        };
    } catch (e) {
         return {
            title: "Industry Update",
            content: text,
            url: ""
        };
    }

  } catch (e) {
    console.error("Trend search failed", e);
    return { title: "Search Failed", content: "Could not fetch trends." };
  }
};