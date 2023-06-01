getCurrentTab = async () => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

populateMemForm = (currentTab) => {
  document.getElementById("title").value = currentTab.title;
  document.getElementById("url").value = currentTab.url;
  document.getElementById("tags").value = "Generating tags...";
  document.getElementById("notes").value = "Generating notes...";
};

getCurrentTab().then((currentTab) => {
  populateMemForm(currentTab);

  chrome.scripting.executeScript({
    target: { tabId: currentTab.id },
    files: ["./services/promptGPT.js"],
  });

  chrome.runtime.onMessage.addListener((message) => {
    const GPT_RESULT = message.value;
    const TEXT_TYPE = message.type;

    if (TEXT_TYPE == "tags") {
      document.getElementById("tags").value = GPT_RESULT;
    } else {
      document.getElementById("notes").value = GPT_RESULT;
    }
  });
});
