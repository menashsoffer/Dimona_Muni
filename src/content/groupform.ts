// The group form (form.html?g=<group number>). Answers are sent to the Google Form behind the scenes
// and land in the same sheet the plenary screen reads.
import type { GroupForm } from "./types.ts";

export const GROUP_FORM: GroupForm = {
  action: "https://docs.google.com/forms/d/e/1FAIpQLSfDGnOJwV0kywjjZ6R3FnGapl1g4In5vcNGIRNs5Av94u8nzg/formResponse",
  group: "entry.1624475687", // gets the group's choice text, exactly as written in the Google Form
  choices: ['מרים כהן, מנמר"ית העירייה', "נחמה אוחנה, מנהלת אגף הרווחה", "אריק, מהנדס העיר"], // same order as GROUPS
  steps: [
    {
      title: "מי אנחנו",
      fields: [
        { entry: "", label: "מי מציג/ה במליאה?", required: true },
        { entry: "", label: "חברי הקבוצה" },
      ],
    },
    {
      title: "מי ישב איתנו",
      say: "פותחים כך: \"ישבנו עם...\"",
      fields: [
        { entry: "", label: "התפקיד שלו/ה במשפט אחד", required: true },
        { entry: "", label: "פרויקט או אתגר משולחן העבודה שלו/ה", long: true },
        { entry: "", label: "משהו שהפתיע אותנו לשמוע" },
      ],
    },
    {
      title: "מה למדנו",
      say: "שלושה דברים: עובדה, תהליך, כלי או דילמה",
      fields: [
        { entry: "", label: "למדנו (א)", required: true },
        { entry: "", label: "למדנו (ב)" },
        { entry: "", label: "למדנו (ג)" },
      ],
    },
    {
      title: "מה אנחנו לוקחים",
      fields: [
        { entry: "", label: "רעיון או כלי שהיינו מיישמים ברשות שלנו", required: true, long: true },
        { entry: "", label: "שאלה שעוד נשארה פתוחה" },
      ],
    },
    {
      title: "המשפט שלנו",
      say: "סוגרים בו את ההצגה במליאה",
      fields: [
        { entry: "", label: "פניה של תושב שתמיד נזכור" },
        { entry: "", label: "והתובנה שיצאנו איתה", required: true },
      ],
    },
  ],
};
