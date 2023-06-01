(() => {
  const PAGE_TEXT = document.body.innerText;
  const API_KEY = ""; // FILL IN YOUR PERSONAL API KEY
  const URL = "https://api.openai.com/v1/chat/completions";
  const NOTES_REQUEST_BODY = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Please distill the following content into a brief (max 2 sentences) useful summary of the website this text was taken from: ${PAGE_TEXT}`,
      },
    ],
    temperature: 0.2,
  };
  const TAGS_REQUEST_BODY = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Please distill the following content into a maximum of three tags: ${PAGE_TEXT}`,
      },
    ],
    temperature: 0.2,
  };

  removeTagsPrefix = (str) => {
    while (str.startsWith("Tags:")) {
      str = str.slice(5).trim();
    }

    return str;
  };

  promptGPT = async (request_body, textType) => {
    await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(request_body),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data here", data);
        if (data.error) {
          // If GPT responds with error, this sets text box to empty
          chrome.runtime.sendMessage({ value: "", type: textType });
        } else {
          let gptResponse = `${data.choices[0].message.content}`;
          gptResponse = removeTagsPrefix(gptResponse);
          chrome.runtime.sendMessage({ value: gptResponse, type: textType });
        }
      });
  };

  promptGPT(TAGS_REQUEST_BODY, "tags");
  promptGPT(NOTES_REQUEST_BODY, "notes");
})();
