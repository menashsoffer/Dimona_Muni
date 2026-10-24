// Group cards that stand up as they come into view, hinged on their bottom edge like a sign
// raised off the table, and lean back into the distance as they leave under the nav.
import { driveCards } from "./run.ts";

export const tiltCards = (selector: string): (() => void) | undefined =>
  driveCards(selector, "tilted", (c, _i, enter, leave) => {
    c.style.rotate = `x ${(enter * 70 - leave * 34).toFixed(1)}deg`;
    c.style.scale = (1 - leave * 0.18).toFixed(3);
    c.style.opacity = (1 - Math.max(enter * 0.9, leave)).toFixed(3);
  });
