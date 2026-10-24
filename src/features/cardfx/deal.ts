// People cards dealt like a deck: each one swings in from the side as it comes into view,
// and is tossed off the other way once it slides up under the nav.
import { driveCards } from "./run.ts";

export const dealCards = (selector: string): (() => void) | undefined =>
  driveCards(selector, "dealt", (c, i, enter, leave) => {
    // Side: the card's own column in a multi-column grid, otherwise alternate.
    const r = c.getBoundingClientRect();
    const grid = c.parentElement?.getBoundingClientRect();
    const off = grid ? r.left + r.width / 2 - (grid.left + grid.width / 2) : 0;
    const side = Math.abs(off) > 20 ? Math.sign(off) : (i % 2 ? -1 : 1);
    const out = leave * leave;
    c.style.translate = `${(side * (enter * 90 + out * 140)).toFixed(1)}px ${(enter * 36 - out * 20).toFixed(1)}px`;
    c.style.rotate = `${(side * (enter * 7 + out * 12)).toFixed(2)}deg`;
    c.style.opacity = (1 - Math.max(enter, out)).toFixed(3);
  });
