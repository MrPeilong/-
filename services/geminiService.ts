import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const getGameCommentary = async (score: number): Promise<string> => {
  const ai = getClient();
  if (!ai) {
    return "GG! (请配置 API Key 以启用 AI 吐槽)";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `你是一个刻薄、讽刺的复古街机 AI。
      玩家刚刚在贪吃蛇游戏中死掉了，得分为 ${score}。
      
      规则：
      1. 如果分数 < 5：狠狠地嘲笑他们太菜了。
      2. 如果分数 5-20：给出一个不痛不痒、消极怠工的评价。
      3. 如果分数 > 20：虽然有点印象深刻，但依然保持机器人的傲慢。
      
      请只输出评论内容。使用中文。不要超过 20 个字。不要带引号。`,
    });

    return response.text || "游戏结束！";
  } catch (error) {
    console.error("Failed to get AI commentary:", error);
    return "系统错误...贪吃蛇重启中...";
  }
};