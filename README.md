# Design Overview

**IMPORTANT**: To utilize the extension's OpenAI GPT functionality, you must fill in your OpenAI API key on line 3 in the file services/promptGPT.js

1. When extension popup is opened, two scripts are loaded via script tags in the popup's HTML
2. These two scripts achieve the following:

   -Access Chrome's tabs API to prepopulate the "title" and "url" field of the popup with the current tab's title and URL
   
   -Add event listeners to buttons in the popup
   
   -Inject a third script into the current tab,
   
3. The injected script obtains the current tab's text content, and uses it to prompt OpenAI's GPT 3.5 model to generate relevant tags and notes for the current Mem

   -The results are displayed in the "notes" and "tags" text fields in the popup
   
   -If an error occurs while contacting GPT 3.5, "notes"/"tags" text fields will be set to empty
   
   -If the "add notes/tags" button is never clicked, no notes/tags will be added to the new Mem


# Challenges encountered

**1. Problem: There is latency associated with contacting OpenAI's GPT to generate relevant tags/notes. This latency is not conducive to a responsive user experience**

**Solutions considered:**
   1. Create a script that runs in the background of the page, so that the relevant tags/notes are ready before the popup is opened
   - Downside of this approach: OpenAI API calls will be made for every site the user visits, which could get expensive since openAI has API usage limits
   2. Use a lower latency GPT model; Some of the earlier GPT-3 models are twice as fast (in terms of compute time) as GPT-3.5
   - Downside of this approach: The responses from the earlier GPT models were not very useful, despite being faster. This may be able to be improved with more specific prompting, however I did not have time to pursue this.

**Solution chosen:**

   The script that makes OpenAI API calls runs only when the popup is opened, to avoid unnescessary API calls on every page visit. Since Tags and Notes are optional, those fields are hidden at first, but the API calls are still occuring in the background. When the user clicks the "add notes/tags" button, notes and tags fields are displayed and the result of the OpenAI API calls are loaded into the fields.
   
   

**2. Problem: Injecting a script into the page creates variables in the global scope; if you close and reopen the extension multiple times, the script is run again, and an error is thrown since variables that have already been declared are attempting to be declared again**

**Solution chosen:** Wrap the script in an immediately executed function to ensure variables inside do not interfere with the global scope.


# Potential Improvements

1. Integrating Google account? Or an alternative so that you don't need an API key to create a Mem
2. Improve the UI; for example highlighting specific fields in red if a required field is empty
3. Tweaking large language model/prompts in order to achieve lower latency notes/tag generation
