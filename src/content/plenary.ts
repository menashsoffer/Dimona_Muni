// The plenary screen (plenary.html): where the group answers come from and how long each group gets.

export const PLENARY = {
  // Id of the Google Sheet that collects the group form's answers.
  // The sheet must be shared as "anyone with the link can view"; only its public CSV is read.
  sheetId: "",
  minutes: 4, // per group
  refreshSeconds: 20, // re-read the answers while the screen is open
};
