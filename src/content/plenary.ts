// The plenary screen (plenary.html): where the group answers come from and how long each group gets.

export const PLENARY = {
  // Id of the Google Sheet that collects the group form's answers.
  // The sheet must be shared as "anyone with the link can view"; only its public CSV is read.
  sheetId: "1lI4xie91iyNh3nwhIlyyy4KrTMFkyZv65mSJ8Ay-ob8",
  // The tab the form writes to ("Form Responses 1"). Without it Google may read another, empty tab.
  gid: "239425730",
  minutes: 4, // per group
  compareMinutes: 2, // "desk against desk"
  refreshSeconds: 20, // re-read the answers while the screen is open
};
