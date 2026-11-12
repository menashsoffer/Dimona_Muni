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
        { entry: "entry.880863007", label: "מי מציג/ה במליאה?", required: true, pick: "one" },
        { entry: "entry.1411893286", label: "חברי הקבוצה", pick: "many" },
      ],
    },
    {
      title: "מי ישב איתנו",
      say: "השאלה של השולחן כבר תופיע על המסך. כאן רק מה שהפתיע אתכם.",
      fields: [
        { entry: "entry.2071948304", label: "משהו שהפתיע אותנו לשמוע" },
      ],
    },
    {
      title: "מה למדנו",
      say: "שלושה דברים, אפשר בעקבות השאלות מחומר ההכנה: עובדה, תהליך, כלי או דילמה",
      fields: [
        { entry: "entry.281831859", label: "למדנו (א)", required: true },
        { entry: "entry.916443668", label: "למדנו (ב)" },
        { entry: "entry.1035500427", label: "למדנו (ג)" },
      ],
    },
    {
      title: "מה אנחנו לוקחים",
      fields: [
        { entry: "entry.1091459384", label: "רעיון או כלי שהיינו מיישמים ברשות שלנו", required: true, long: true },
      ],
    },
    {
      title: "התובנה מהשולחן שלנו",
      say: "סוגרים בה את ההצגה במליאה, לצד התובנות של שני השולחנות האחרים",
      fields: [
        { entry: "entry.203946102", label: "רגע או דוגמה מהשולחן שתמיד נזכור" },
        { entry: "entry.1942582713", label: "התובנה: איך העירייה משפיעה על חיי התושב מהזווית שלנו", required: true },
      ],
    },
  ],
};
