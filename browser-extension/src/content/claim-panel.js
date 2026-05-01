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
  constructor(root) {
    this.root = root;
    this.el = document.createElement("section");
    this.el.className = "ec-claim-panel";
    this.el.hidden = true;
    this.currentClaim = null;
    this.root.append(this.el);
  }

  expand(claim, top = 80) {
    this.currentClaim = claim || null;
    if (!this.currentClaim) {
      this.collapse();
      return;
    }
    const verdict = String(claim.verdict || "mixed");
    const score = claim.score == null ? "n/a" : Math.round(Number(claim.score) * 100);
    const rationale = claim.rationale || "ACC found limited structural support.";
    this.el.innerHTML = `
      <div class="ec-panel-kicker">${escapeHtml(verdict)} · ${escapeHtml(score)}${score === "n/a" ? "" : "%"}</div>
      <div class="ec-panel-text">${escapeHtml(claim.text || "Claim")}</div>
      <div class="ec-panel-rationale">${escapeHtml(rationale)}</div>
      ${renderFederationBadge(claim)}
    `;
    this.el.style.top = `${Math.max(16, Math.min(Number(top) || 80, window.innerHeight - 180))}px`;
    this.el.hidden = false;
  }

  collapse() {
    this.el.hidden = true;
    this.currentClaim = null;
  }

  isOpen() {
    return !this.el.hidden;
  }

  getCurrentClaim() {
    return this.currentClaim;
  }
}
