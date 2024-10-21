const DEEPSEEK_API_KEY = 'sk-4a93fe1df5ad4977823c4c8c775f3552';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// 保留原始的 OpenAI 常量
const OPENAI_API_KEY = 'your_openai_api_key_here';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// 添加 GPT 中转服务的常量
const GPT_PROXY_API_KEY = 'sk-HCTc2ukDHOH3DBqHjiARPDCcoLprFKGlaXT67zfNUC8hPZLW';
const GPT_PROXY_API_URL = 'https://api.chatanywhere.tech/v1/chat/completions';

// 添加 DeepBricks 中转服务的常量 https://www.bilibili.com/video/BV1nm42137jT?spm_id_from=333.788.recommend_more_video.1&vd_source=20eec788b9d1cec8ca6afbcdd638953f
const DEEPBRICKS_API_KEY = 'sk-PNab5CAdTnzN4ekzLMrELcAfp2fqCsaI07OookD41rJo2sSG';
const DEEPBRICKS_API_URL = 'https://api.deepbricks.ai/v1/chat/completions';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export type ModelType = 'deepbricks' | 'gpt-proxy' | 'openai' | 'deepseek';

export async function sendMessage(messages: Message[], model: ModelType = 'deepbricks') {
  let apiUrl: string;
  let apiKey: string;
  let modelName: string;

  switch (model) {
    case 'deepbricks':
      apiUrl = DEEPBRICKS_API_URL;
      apiKey = DEEPBRICKS_API_KEY;
      modelName = 'gpt-4o'; // 或者您想使用的其他模型
      break;
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

  if (model === 'deepbricks') {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: messages,
        stream: true, // 启用流式响应
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    return {
      async* [Symbol.asyncIterator]() {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') return;
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices[0]?.delta?.content || '';
                if (content) yield content;
              } catch (e) {
                console.error('Error parsing JSON:', e);
              }
            }
          }
        }
      }
    };
  } else {
    // 保留原有的非流式处理逻辑
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
}
