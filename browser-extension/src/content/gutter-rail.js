import { ClaimPanel } from "./claim-panel.js";

export class GutterRail {
  constructor({ side = "right" } = {}) {
    this.side = side;
    this.visible = true;
    this.dots = [];
    this.host = null;
    this.root = null;
    this.rail = null;
    this.panel = null;
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
        :host { all: initial; }
        .ec-rail {
          position: fixed;
          top: 0;
          bottom: 0;
          width: 18px;
          pointer-events: none;
        }
        .ec-rail.right { right: 8px; }
        .ec-rail.left { left: 8px; }
        .ec-dot {
          position: absolute;
          width: 12px;
          height: 12px;
          border: 2px solid #fff;
          border-radius: 50%;
          box-shadow: 0 1px 8px rgba(0,0,0,.24);
          cursor: pointer;
          pointer-events: auto;
          transform: translateY(-50%);
        }
        .ec-dot.trustworthy { background: #27805f; }
        .ec-dot.mixed { background: #b06f16; }
        .ec-dot.unreliable { background: #b33b3b; }
        .ec-dot.fiction { background: #5f6472; }
        .ec-claim-panel {
          position: fixed;
          right: 30px;
          max-width: 320px;
          padding: 12px;
          border: 1px solid rgba(30, 36, 42, .16);
          border-radius: 8px;
          background: #fffdf8;
          color: #1f2428;
          box-shadow: 0 12px 32px rgba(0,0,0,.22);
          font: 13px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          pointer-events: auto;
        }
        .ec-panel-kicker {
          margin-bottom: 6px;
          color: #59636d;
          font-size: 11px;
          text-transform: uppercase;
        }
        .ec-panel-text { font-weight: 650; }
        .ec-panel-rationale { margin-top: 8px; color: #46515c; }
        .ec-federation-badge {
          display: inline-block;
          margin-top: 10px;
          padding: 4px 6px;
          border: 1px solid #c8d7db;
          border-radius: 6px;
          background: #eef7f8;
          color: #254f58;
          font-size: 11px;
        }
        .ec-federation-link { color: #1f6674; }
      </style>
      <div class="ec-rail ${this.side}"></div>
    `;
    this.rail = this.root.querySelector(".ec-rail");
    this.panel = new ClaimPanel(this.root);
    document.documentElement.append(this.host);
  }

  detach() {
    this.host?.remove();
    this.host = null;
    this.root = null;
    this.rail = null;
    this.panel = null;
  }

  setState({ side, visible } = {}) {
    if (side) {
      this.setPosition(side);
    }
    if (visible != null) {
      this.setVisibility(Boolean(visible));
    }
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
    for (const dot of this.dots) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `ec-dot ${dot.verdict || "mixed"}`;
      button.style.top = `${Math.max(18, Number(dot.top) || 18)}px`;
      button.title = dot.label || "ACC claim";
      button.addEventListener("mouseenter", () => this.panel?.expand(dot.claim, dot.top));
      button.addEventListener("focus", () => this.panel?.expand(dot.claim, dot.top));
      button.addEventListener("click", () => {
        dot.element?.scrollIntoView?.({ block: "center", behavior: "smooth" });
        this.panel?.expand(dot.claim, dot.top);
      });
      this.rail.append(button);
    }
  }
}
