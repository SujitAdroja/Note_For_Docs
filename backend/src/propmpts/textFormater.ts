export const prompt = `
You are given raw OCR-extracted clinical notes. 
Your task is to:
1. Correct spelling and grammar errors.
2. Preserve only the information present in the input text.
3. Structure the content into the following Markdown sections using proper Markdown syntax:
   ## Patient Information
   ## Doctor Information
   ## Clinical Notes
4. Use bullet points or numbered lists where appropriate.
5. Do NOT add or infer any details from external knowledge.
6. Output only the cleaned and formatted note in Markdown.

Raw OCR text:
`;
