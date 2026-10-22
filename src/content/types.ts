// Shapes of the site's content. Edit the data in the files next to this one.

export interface Slot {
  from: string; // "HH:MM", Israel time
  to: string;
  title: string;
  note?: string;
  brk?: boolean; // breaks and logistics, shown muted
}

export interface Person {
  when: string;
  name: string;
  role: string;
  text?: string;
  photo?: string; // file name in public/assets/people/, without ".png"
  initial?: string; // shown when there is no photo
}

export interface Group {
  lead: string;
  role: string;
  project?: string;
}

export interface Source {
  label: string;
  url: string;
}

export interface Question {
  q: string;
  options: string[];
  answer: number; // index into options
  fact: string;
  sources: Source[];
}

export interface Ending {
  min: number; // lowest score that gets this line
  text: string;
}

export interface Video {
  id: string; // YouTube video id
  title: string;
}

export interface Quiz {
  title: string;
  intro: string;
  questions: Question[];
  endings: Ending[];
}
