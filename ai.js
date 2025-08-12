const OPENROUTER_API_KEY =
  "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";

async function chatWithOpenRouter(message) {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b:free",
        messages: [{ role: "user", content: message }],
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

(async () => {
  try {
    const reply = await chatWithOpenRouter(
      "do you know bangla language"
    );
    console.log("OpenRouter GPT says:", reply);
  } catch (err) {
    console.error(err);
  }
})();
