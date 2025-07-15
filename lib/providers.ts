export const PROVIDERS = {
  "openai-compatible": {
    name: "OpenAI Compatible",
    max_tokens: 128_000,
    id: "openai-compatible",
  },
};

export const MODELS = [
  {
    value: "gpt-4o-mini", // Default model, can be overridden by user
    label: "GPT-4o Mini (Default)",
    providers: ["openai-compatible"],
    autoProvider: "openai-compatible",
    isThinker: false,
  },
];
