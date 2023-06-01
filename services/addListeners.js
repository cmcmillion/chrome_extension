displayMessage = (message, status) => {
  const MESSAGE_BOX = document.getElementsByClassName("message")[0];
  MESSAGE_BOX.textContent = message;
  MESSAGE_BOX.className = "";
  MESSAGE_BOX.classList.add("message");
  MESSAGE_BOX.classList.add(status);
};

isValidMem = (formData) => {
  if (!formData.elements.apikey.value) {
    displayMessage("An API key is required", "error");
    return false;
  } else if (!formData.elements.title.value) {
    displayMessage("A title is required", "error");
    return false;
  }
  return true;
};

formatTags = (tags) => {
  if (!tags || tags.trim() === "") {
    return ""; // Return empty string if input is empty or only contains whitespace
  }

  const words = tags.split(" ");
  const hashtags = words.map((word) => "#" + word);
  const result = hashtags.join(" ");

  return result;
};

// If add notes/tags button was never clicked, submit empty notes/tags
setNotesAndTags = (notes, tags) => {
  const expandLink = document.getElementById("expand-btn");
  const expandLinkCSS = window.getComputedStyle(expandLink);
  console.log("asdf", expandLinkCSS.getPropertyValue("display"));

  if (expandLinkCSS.getPropertyValue("display") !== "none") {
    notes = "";
    tags = "";
  } else {
    tags = formatTags(tags);
  }
  return [notes, tags];
};

createMem = async (formData) => {
  const apikey = formData.elements.apikey.value;
  const title = formData.elements.title.value;
  const memUrl = formData.elements.url.value;
  const [notes, tags] = setNotesAndTags(
    formData.elements.notes.value,
    formData.elements.tags.value
  );

  let data = { content: `${title} \n ${memUrl} \n ${tags} \n ${notes}` };
  const url = "https://api.mem.ai/v0/mems";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `ApiAccessToken ${apikey}`,
    },
    body: JSON.stringify(data),
  });

  return response;
};

handleResponse = (response) => {
  if (!response || !response.ok) {
    displayMessage("Could not create Mem. Check your API key", "error");
  } else {
    displayMessage("Saved to your Mem!", "success"); // todo: add checkmark
  }
};

document.getElementById("form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (isValidMem(event.target)) {
    createMem(event.target).then((response) => {
      handleResponse(response);
    });
  }
});

document
  .getElementsByClassName("cancel")[0]
  .addEventListener("click", (event) => {
    window.close();
  });

const expandLink = document.getElementById("expand-btn");

expandLink.addEventListener("click", function (event) {
  event.preventDefault();
  const notesBox = document.querySelector(".expand-box");
  expandLink.style.display = "none";
  notesBox.style.display = "block";
});
