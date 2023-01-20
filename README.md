***List Quest Invites is currently in beta. There are still some edge cases that haven't been tested yet, so it may not work perfectly for you. If you're not okay with this, best to wait until Version 1 is released! If you get an error while running this script or the output is not what you expect, please let me know!***

## Summary
Gathers Habitica quest invite emails from the user's Gmail account and lists them in a Google Sheet, with columns for quest name, date/time invited, username, quest type, and email subject.

## Setup Instructions
You need to use a desktop computer for this. It will not work on a phone or tablet!
1. Click [here](https://script.google.com/d/1srhmJoKC1llImave5zCZ7C_cxgk-2ne3knkip1mbRw7lSTNcb76Gr_LY/edit?usp=sharing) to go to the List Quest Invites script. If you're not already signed into your Google account, you will be asked to sign in.
2. In the main menu on the left, click on "Overview" (looks like a lowercase letter i inside a circle).
3. Click the "Make a copy" button (looks like two pages of paper).
4. At the top of your screen, click on "Copy of List Quest Invites". Rename it "List Quest Invites" and click the "Rename" button.
5. Click [here](https://habitica.com/user/settings/api) to open your API Settings. Highlight and copy your User ID (it looks something like this: `35c3fb6f-fb98-4bc3-b57a-ac01137d0847`). In the List Quest Invites script, paste your User ID between the quotations where it says `const USER_ID = "";`. It should now look something like this: `const USER_ID = "35c3fb6f-fb98-4bc3-b57a-ac01137d0847";`
6. On the same page where you copied your User ID, click the "Show API Token" button, and copy your API Token. In the List Quest Invites script, paste your API Token between the quotations where it says `const API_TOKEN = "";`. It should now look something like this: `const API_TOKEN = "35c3fb6f-fb98-4bc3-b57a-ac01137d0847";`
7. [Create a new Google Sheet](https://sheets.google.com/create) and name it something like "Habitica Quest Invites". Click the "Share" button near the top right corner of the page (looks like a little person). Click the dropdown under "General access", and select "Anyone with the link". Then click the "Copy link" button.
8. Paste the spreadsheet URL inside the quotations where it says `const QUEST_INVITES_SPREADSHEET_URL = "";`. If you've changed the tab name for the sheet you want to print the quest invites to, paste the tab name inside the quotes where it says `const QUEST_INVITES_SPREADSHEET_TAB_NAME = "";`.
9. Edit all the other settings (`const`s) in the script to your liking. Only edit in between the `=` and the `;`. If there are quotations `""` in between the `=` and the `;`, just type in between the quotations.
10. Click the "Save project" button near the top of the page (looks like a floppy disk).
11. Click the "Run" button near the top of the page. Wait for it to say "Execution completed".

## Updating the Script
You need to use a desktop computer for this. It will not work on a phone or tablet!
1. Copy & paste your settings (`const`s) into a text editor so you can reference them while setting up the new version.
2. In the main menu on the left, click on "Overview" (looks like a lowercase letter i inside a circle).
3. Click the "Remove project" button (looks like a trash can).
4. Follow the [Setup Instructions](#setup-instructions) above.

## Contact
❔ Questions: [https://github.com/bumbleshoot/list-quest-invites/discussions/categories/q-a](https://github.com/bumbleshoot/list-quest-invites/discussions/categories/q-a)  
💡 Suggestions: [https://github.com/bumbleshoot/list-quest-invites/discussions/categories/suggestions](https://github.com/bumbleshoot/list-quest-invites/discussions/categories/suggestions)  
🐞 Report a bug: [https://github.com/bumbleshoot/list-quest-invites/issues](https://github.com/bumbleshoot/list-quest-invites/issues)  
💗 Donate: [https://github.com/sponsors/bumbleshoot](https://github.com/sponsors/bumbleshoot)