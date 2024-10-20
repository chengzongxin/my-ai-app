const DEEPSEEK_API_KEY = 'sk-4a93fe1df5ad4977823c4c8c775f3552';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// 保留原始的 OpenAI 常量
const OPENAI_API_KEY = 'your_openai_api_key_here'; // 请替换为您的 OpenAI API 密钥
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// 添加 GPT 中转服务的常量
const GPT_PROXY_API_KEY = 'sk-HCTc2ukDHOH3DBqHjiARPDCcoLprFKGlaXT67zfNUC8hPZLW';
const GPT_PROXY_API_URL = 'https://api.chatanywhere.tech/v1/chat/completions';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export type ModelType = 'gpt-proxy' | 'openai' | 'deepseek';

export async function sendMessage(messages: Message[], model: ModelType = 'gpt-proxy') {
  let apiUrl: string;
  let apiKey: string;
  let modelName: string;

  switch (model) {
    case 'gpt-proxy':
      apiUrl = GPT_PROXY_API_URL;
      apiKey = GPT_PROXY_API_KEY;
      modelName = 'gpt-3.5-turbo';
      break;
    case 'openai':
      apiUrl = OPENAI_API_URL;
      apiKey = OPENAI_API_KEY;
      modelName = 'gpt-3.5-turbo';
      break;
    case 'deepseek':
      apiUrl = DEEPSEEK_API_URL;
      apiKey = DEEPSEEK_API_KEY;
      modelName = 'deepseek-chat';
      break;
    default:
      throw new Error('Invalid model type');
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelName,
      messages: messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
