export class RailDot {
  constructor(dot, handlers = {}) {
    this.dot = dot;
    this.handlers = handlers;
    this.element = document.createElement("button");
    this.element.type = "button";
    this.element.className = `ec-dot ${dot.verdict || "mixed"}`;
    this.element.style.top = `${Math.max(18, Number(dot.top) || 18)}px`;
    this.element.title = dot.label || "ACC claim";
    this.element.setAttribute("aria-label", dot.label || "ACC claim");
    this.element.addEventListener("mouseenter", () => this.handlers.onOpen?.(this.element));
    this.element.addEventListener("mouseleave", () => this.handlers.onClose?.());
    this.element.addEventListener("focus", () => this.handlers.onOpen?.(this.element));
    this.element.addEventListener("blur", () => this.handlers.onClose?.());
    this.element.addEventListener("click", () => this.handlers.onPin?.(this.element));
    this.element.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.handlers.onPin?.(this.element);
      }
    });
  }
}
