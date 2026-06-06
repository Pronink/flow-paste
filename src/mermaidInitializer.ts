import mermaid from "mermaid";

export function configureMermaid(color: string) {
  mermaid.initialize({
    startOnLoad: false,
    theme: "base",
    themeVariables: {
      primaryColor: color,
      primaryTextColor: "#fff",
      primaryBorderColor: color,
    },
  });
}