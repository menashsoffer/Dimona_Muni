// YouTube player that plays inside the page. It loads YouTube only after a tap
// (lighter page, no tracking before play) and keeps a link out as a fallback.
import type { Video } from "../../content/types.ts";
import { esc } from "../../core/dom.ts";

const embedUrl = (id: string): string =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&hl=he`;

export function mountPlayer(host: HTMLElement, video: Video): void {
  host.innerHTML = `
    <div class="player">
      <button class="poster" type="button" aria-label="הפעלת הסרטון: ${esc(video.title)}">
        <img src="https://i.ytimg.com/vi/${video.id}/hqdefault.jpg" alt="" loading="lazy">
        <span class="play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z"/></svg></span>
      </button>
    </div>
    <div class="vmeta">
      <h3>${esc(video.title)}</h3>
      <a class="s" href="https://youtu.be/${video.id}" target="_blank" rel="noopener">הסרטון לא עולה? צפייה ביוטיוב</a>
    </div>`;

  const poster = host.querySelector<HTMLButtonElement>(".poster")!;
  // No thumbnail (offline, or blocked) → the sunset gradient behind it stays.
  poster.querySelector("img")!.addEventListener("error", (e) => (e.target as HTMLElement).remove());
  poster.addEventListener("click", () => {
    const frame = document.createElement("iframe");
    frame.src = embedUrl(video.id);
    frame.title = video.title;
    frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    frame.allowFullscreen = true;
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    poster.replaceWith(frame);
  }, { once: true });
}
