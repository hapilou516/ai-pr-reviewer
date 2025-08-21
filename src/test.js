import OpenAI from "openai";
const client = new OpenAI({
  apiKey:"sk-9jJGTNeyN7T4bBeilg9uNkIttV7ujvSReNJpwl8kh4d85opO",
});

const response = await client.responses.create({
  model: "gpt-5",
  input: "Write a short bedtime story about a unicorn.",
});

console.log(response.output_text);