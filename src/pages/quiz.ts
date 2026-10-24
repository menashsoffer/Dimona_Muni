// Quiz page: "מכירים את דימונה?".
import "../styles/site.css";
import "../features/quiz/quiz.css";
import "../features/confetti/confetti.css";

import { QUIZ } from "../content/quiz.ts";
import { byId } from "../core/dom.ts";
import { renderNav } from "../core/nav.ts";
import { scrollEffects } from "../core/scroll.ts";
import { startQuiz } from "../features/quiz/quiz.ts";
import { mountSun } from "../features/sun/sun.ts";

renderNav("quiz");
mountSun();
scrollEffects();
startQuiz(byId("stage"), QUIZ);
