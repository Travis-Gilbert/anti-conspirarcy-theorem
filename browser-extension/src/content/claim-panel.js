import { CATALOG_PUBLIC_URL } from "../shared/config.js";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderFederationBadge(claim) {
  const entry = claim?.federation?.catalog_entry;
  if (!entry?.correlation_boosted) {
    return "";
  }
  const peerCount = Number(entry.peer_count || 0);
  const updated = entry.updated_at ? ` title="Last updated ${escapeHtml(entry.updated_at)}"` : "";
  const structuralHash = claim?.federation?.structural_hash || entry.structural_hash;
  if (!/^[a-f0-9]{64}$/i.test(String(structuralHash || ""))) {
    return `<span class="ec-federation-badge"${updated}>Flagged by ${peerCount} peers</span>`;
  }
  const href = `${CATALOG_PUBLIC_URL.replace(/\/$/, "")}/entry/${encodeURIComponent(structuralHash)}`;
  return `<span class="ec-federation-badge"${updated}>Flagged by ${peerCount} peers <a class="ec-federation-link" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">View on the network</a></span>`;
}

export class ClaimPanel {
  constructor(root, { side = "right" } = {}) {
    this.root = root;
    this.side = side;
    this.el = document.createElement("section");
    this.el.className = "ec-claim-panel";
    this.el.setAttribute("role", "dialog");
    this.el.setAttribute("aria-live", "polite");
    this.el.hidden = true;
    this.currentClaim = null;
    this.anchor = null;
    this.pinned = false;
    this.openTimer = null;
    this.closeTimer = null;
    this.el.addEventListener("mouseenter", () => this.clearCloseTimer());
    this.el.addEventListener("mouseleave", () => this.scheduleCollapse());
    this.el.addEventListener("click", (event) => this.handleClick(event));
    this.root.append(this.el);
  }

  setSide(side) {
    this.side = side === "left" ? "left" : "right";
    this.el.classList.toggle("left", this.side === "left");
  }

  scheduleExpand(claim, top = 80, anchor = null) {
    if (this.pinned) {
      return;
    }
    this.clearCloseTimer();
    clearTimeout(this.openTimer);
    this.openTimer = setTimeout(() => this.expand(claim, top, anchor), 120);
  }

  expand(claim, top = 80, anchor = null, options = {}) {
    clearTimeout(this.openTimer);
    this.clearCloseTimer();
    this.currentClaim = claim || null;
    this.anchor = anchor || this.anchor;
    this.pinned = options.pinned === true || this.pinned;
    if (!this.currentClaim) {
      this.collapse();
      return;
    }
    const verdict = String(claim.verdict || "mixed");
    const score = claim.score == null ? "n/a" : Math.round(Number(claim.score) * 100);
    const rationale = claim.rationale || "ACC found limited structural support.";
    this.el.innerHTML = `
      <div class="ec-panel-head">
        <div>
          <div class="ec-panel-kicker">${escapeHtml(verdict)} / ${escapeHtml(score)}${score === "n/a" ? "" : "%"}</div>
        </div>
        <div class="ec-panel-actions">
          <button class="ec-panel-action" type="button" data-action="pin" aria-pressed="${this.pinned ? "true" : "false"}" title="${this.pinned ? "Unpin" : "Pin"}">${this.pinned ? "off" : "pin"}</button>
          <button class="ec-panel-action" type="button" data-action="close" title="Close">x</button>
        </div>
      </div>
      <div class="ec-panel-text">${escapeHtml(claim.text || "Claim")}</div>
      <div class="ec-panel-rationale">${escapeHtml(rationale)}</div>
      ${renderFederationBadge(claim)}
    `;
    this.setSide(this.side);
    this.el.style.top = `${Math.max(16, Math.min(Number(top) || 80, window.innerHeight - 180))}px`;
    this.el.hidden = false;
  }

  scheduleCollapse(delay = 180) {
    if (this.pinned) {
      return;
    }
    this.clearCloseTimer();
    this.closeTimer = setTimeout(() => this.collapse({ restoreFocus: false }), delay);
  }

  clearCloseTimer() {
    clearTimeout(this.closeTimer);
    this.closeTimer = null;
  }

  collapse({ restoreFocus = false } = {}) {
    clearTimeout(this.openTimer);
    this.clearCloseTimer();
    this.el.hidden = true;
    this.currentClaim = null;
    this.pinned = false;
    if (restoreFocus) {
      this.anchor?.focus?.({ preventScroll: true });
    }
  }

  handleClick(event) {
    const button = event.target?.closest?.("[data-action]");
    if (!button) {
      return;
    }
    const action = button.getAttribute("data-action");
    if (action === "close") {
      this.collapse({ restoreFocus: true });
      return;
    }
    if (action === "pin") {
      this.pinned = !this.pinned;
      if (!this.pinned) {
        this.scheduleCollapse(0);
        return;
      }
      this.expand(this.currentClaim, Number.parseFloat(this.el.style.top) || 80, this.anchor, { pinned: true });
    }
  }

  isOpen() {
    return !this.el.hidden;
  }

  getCurrentClaim() {
    return this.currentClaim;
  }
}
