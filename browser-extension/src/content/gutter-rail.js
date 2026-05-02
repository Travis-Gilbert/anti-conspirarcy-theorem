import { ClaimPanel } from "./claim-panel.js";
import { RailDot } from "./rail-dot.js";

const RAIL_GAP = 18;
const MIN_TOP = 18;

export class GutterRail {
  constructor({ side = "right" } = {}) {
    this.side = side;
    this.visible = true;
    this.motion = "system";
    this.typography = "system";
    this.dots = [];
    this.host = null;
    this.root = null;
    this.rail = null;
    this.panel = null;
    this.handleDocumentPointerDown = this.handleDocumentPointerDown.bind(this);
    this.handleDocumentKeyDown = this.handleDocumentKeyDown.bind(this);
  }

  attach() {
    if (this.host) {
      return;
    }
    this.host = document.createElement("div");
    this.host.id = "anti-conspiracy-theorem-root";
    this.host.style.position = "fixed";
    this.host.style.inset = "0";
    this.host.style.pointerEvents = "none";
    this.host.style.zIndex = "2147483647";
    this.root = this.host.attachShadow({ mode: "closed" });
    this.root.innerHTML = `
      <style>
        @font-face {
          font-family: "ACT System";
          src: local("-apple-system"), local("BlinkMacSystemFont"), local("Segoe UI");
          font-display: swap;
        }
        :host { all: initial; }
        :host {
          --act-surface: oklch(0.985 0.006 84);
          --act-surface-strong: oklch(0.955 0.012 84);
          --act-ink: oklch(0.25 0.018 238);
          --act-muted: oklch(0.46 0.02 238);
          --act-border: oklch(0.82 0.018 84);
          --act-teal: oklch(0.53 0.095 205);
          --act-gold: oklch(0.62 0.12 72);
          --act-red: oklch(0.52 0.14 31);
          --act-slate: oklch(0.5 0.025 250);
          --act-focus: oklch(0.56 0.14 205);
          color-scheme: light;
        }
        .ec-rail {
          position: fixed;
          top: 0;
          bottom: 0;
          width: 26px;
          pointer-events: none;
        }
        .ec-rail.right { right: 8px; }
        .ec-rail.left { left: 8px; }
        .ec-dot {
          position: absolute;
          width: 14px;
          height: 14px;
          padding: 0;
          border: 2px solid var(--act-surface);
          border-radius: 50%;
          box-shadow: 0 1px 8px oklch(0.18 0.02 238 / 0.24);
          cursor: pointer;
          pointer-events: auto;
          transform: translate(-50%, -50%);
          left: 50%;
          transition: transform 120ms ease-out, box-shadow 120ms ease-out;
        }
        .ec-dot:hover,
        .ec-dot:focus-visible {
          box-shadow: 0 2px 12px oklch(0.18 0.02 238 / 0.32);
          outline: 2px solid var(--act-focus);
          outline-offset: 2px;
          transform: translate(-50%, -50%) scale(1.12);
        }
        .ec-dot.trustworthy { background: var(--act-teal); }
        .ec-dot.mixed { background: var(--act-gold); }
        .ec-dot.unreliable { background: var(--act-red); }
        .ec-dot.fiction { background: var(--act-slate); }
        .ec-claim-panel {
          position: fixed;
          right: 30px;
          width: min(320px, calc(100vw - 60px));
          max-height: min(420px, calc(100vh - 32px));
          overflow: auto;
          padding: 12px;
          border: 1px solid var(--act-border);
          border-radius: 8px;
          background: var(--act-surface);
          color: var(--act-ink);
          box-shadow: 0 12px 32px oklch(0.18 0.02 238 / 0.22);
          font: 13px/1.45 "ACT System", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          pointer-events: auto;
        }
        .ec-claim-panel.left {
          left: 30px;
          right: auto;
        }
        .ec-panel-head {
          display: flex;
          align-items: start;
          justify-content: space-between;
          gap: 10px;
        }
        .ec-panel-kicker {
          margin-bottom: 6px;
          color: var(--act-muted);
          font-size: 11px;
          text-transform: uppercase;
        }
        .ec-panel-actions {
          display: inline-flex;
          gap: 4px;
        }
        .ec-panel-action {
          display: inline-grid;
          place-items: center;
          min-width: 32px;
          height: 26px;
          padding: 0 6px;
          border: 1px solid var(--act-border);
          border-radius: 6px;
          background: var(--act-surface-strong);
          color: var(--act-ink);
          cursor: pointer;
        }
        .ec-panel-action:focus-visible {
          outline: 2px solid var(--act-focus);
          outline-offset: 2px;
        }
        .ec-panel-text { font-weight: 650; }
        .ec-panel-rationale { margin-top: 8px; color: var(--act-muted); }
        .ec-federation-badge {
          display: inline-block;
          margin-top: 10px;
          padding: 4px 6px;
          border: 1px solid oklch(0.78 0.035 205);
          border-radius: 6px;
          background: oklch(0.95 0.018 205);
          color: oklch(0.35 0.06 205);
          font-size: 11px;
        }
        .ec-federation-link { color: oklch(0.42 0.08 205); }
        :host(.compact) .ec-claim-panel {
          font-size: 12px;
          line-height: 1.35;
        }
        :host(.serif) .ec-claim-panel {
          font-family: Georgia, "Times New Roman", serif;
        }
        :host(.reduce-motion) .ec-dot {
          transition: none;
        }
      </style>
      <div class="ec-rail ${this.side}"></div>
    `;
    this.rail = this.root.querySelector(".ec-rail");
    this.panel = new ClaimPanel(this.root, { side: this.side });
    document.documentElement.append(this.host);
    document.addEventListener("pointerdown", this.handleDocumentPointerDown, true);
    document.addEventListener("keydown", this.handleDocumentKeyDown, true);
    this.applyHostClasses();
  }

  detach() {
    this.host?.remove();
    this.host = null;
    this.root = null;
    this.rail = null;
    this.panel = null;
    document.removeEventListener("pointerdown", this.handleDocumentPointerDown, true);
    document.removeEventListener("keydown", this.handleDocumentKeyDown, true);
  }

  setState({ side, visible, motion, typography } = {}) {
    if (side) {
      this.setPosition(side);
    }
    if (visible != null) {
      this.setVisibility(Boolean(visible));
    }
    if (motion) {
      this.motion = motion;
    }
    if (typography) {
      this.typography = typography;
    }
    this.applyHostClasses();
  }

  setDots(dots = []) {
    this.dots = Array.isArray(dots) ? dots : [];
    this.render();
  }

  setPosition(side) {
    this.side = side === "left" ? "left" : "right";
    if (!this.rail) {
      return;
    }
    this.rail.classList.toggle("left", this.side === "left");
    this.rail.classList.toggle("right", this.side !== "left");
    this.panel?.setSide(this.side);
  }

  setVisibility(visible) {
    this.visible = Boolean(visible);
    if (this.host) {
      this.host.hidden = !this.visible;
    }
  }

  render() {
    if (!this.rail) {
      this.attach();
    }
    this.rail.replaceChildren();
    for (const dot of stackRailDots(this.dots)) {
      const railDot = new RailDot(dot, {
        onOpen: (anchor) => this.panel?.scheduleExpand(dot.claim, dot.top, anchor),
        onClose: () => this.panel?.scheduleCollapse(),
        onPin: (anchor) => {
          dot.element?.scrollIntoView?.({
            block: "center",
            behavior: this.motion === "reduce" ? "auto" : "smooth",
          });
          this.panel?.expand(dot.claim, dot.top, anchor, { pinned: true });
        },
      });
      this.rail.append(railDot.element);
    }
  }

  handleDocumentPointerDown(event) {
    if (!this.panel?.isOpen()) {
      return;
    }
    const path = event.composedPath?.() || [];
    if (path.includes(this.host)) {
      return;
    }
    this.panel.collapse({ restoreFocus: false });
  }

  handleDocumentKeyDown(event) {
    if (event.key === "Escape" && this.panel?.isOpen()) {
      this.panel.collapse({ restoreFocus: true });
    }
  }

  applyHostClasses() {
    if (!this.host) {
      return;
    }
    this.host.classList.toggle("reduce-motion", this.motion === "reduce");
    this.host.classList.toggle("serif", this.typography === "serif");
    this.host.classList.toggle("compact", this.typography === "compact");
  }
}

export function stackRailDots(dots = []) {
  const sorted = [...dots].sort((a, b) => (Number(a.top) || 0) - (Number(b.top) || 0));
  let previousTop = 0;
  return sorted.map((dot) => {
    const rawTop = Math.max(MIN_TOP, Number(dot.top) || MIN_TOP);
    const top = Math.max(rawTop, previousTop + RAIL_GAP);
    previousTop = top;
    return { ...dot, top };
  });
}
