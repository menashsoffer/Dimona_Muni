// Plenary screen for the projector: each group's form answers, revealed step by step.
import "../styles/tokens.css";
import "../features/plenary/plenary.css";

import { byId } from "../core/dom.ts";
import { startShow } from "../features/plenary/show.ts";

startShow(byId("stage"), byId("clock"));
