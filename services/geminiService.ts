import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `
你是一位名叫“原子 AI”的专家级习惯教练，深受詹姆斯·克利尔的《原子习惯》哲学影响。

你的目标：帮助用户建立有效的系统，而不仅仅是设定目标。专注于基于身份的习惯、1%法则和行为改变的四大定律（让它显而易见、让它有吸引力、让它简便易行、让它令人愉悦）。

语气：鼓励、简洁、实用，略带斯多葛学派风格但充满温情。除非用户要求深入探讨，否则回复应简短（100字以内）。

关键原则：
1. 身份认同：“我是那种...的人”
2. 两分钟规则：“只做两分钟的习惯。”
3. 习惯叠加：“在[当前习惯]之后，我将[新习惯]。”
4. 绝不亦步亦趋：如果错过了一天，立即重回正轨。
5. 潜能平台期：结果需要时间才能显现。

如果用户询问有关习惯的问题，请建议具体的执行意图（我将在[时间]在[地点][行为]）。
`;

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("Gemini API Key is missing");
      return null;
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const startCoachChat = () => {
  const ai = getAI();
  if (!ai) return null;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });
};

export const sendMessageToCoach = async (chat: any, message: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "我现在有点混乱。让我们专注于一小步。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "我似乎离线了。记住两分钟规则！";
  }
};