// People cards dealt like a deck: each one swings in from the side as it comes into view,
// and is tossed off the other way once it slides up under the nav.
import { driveCards } from "./run.ts";

export const dealCards = (selector: string): (() => void) | undefined =>
  driveCards(selector, "dealt", (c, i, enter, leave) => {
    // Cards stand one at a time in a single column, so they alternate sides.
    const side = i % 2 ? -1 : 1;
    const out = leave * leave;
    c.style.translate = `${(side * (enter * 90 + out * 140)).toFixed(1)}px ${(enter * 36 - out * 20).toFixed(1)}px`;
    c.style.rotate = `${(side * (enter * 7 + out * 12)).toFixed(2)}deg`;
    c.style.opacity = (1 - Math.max(enter, out)).toFixed(3);
  });
