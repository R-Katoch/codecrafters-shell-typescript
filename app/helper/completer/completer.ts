import { getLongestCommonPrefix } from "./lcp";
import { renderSuggestions, ringBell } from "./renderer";

import { getCommandMatches } from "./providers";
import { getFileMatches } from "./providers";

export class CompletionEngine {
  private tabPressedCount = 0;

  complete(line: string): [string[], string] {
    const tokens = line.split(" ");

    const currentToken = tokens[tokens.length - 1];

    const isCommand = tokens.length === 1 && !line.endsWith(" ");

    const matches = isCommand
      ? getCommandMatches(currentToken)
      : getFileMatches(currentToken);

    // no matches
    if (matches.length === 0) {
      this.tabPressedCount = 0;

      ringBell();

      return [[], line];
    }

    // helper to rebuild line
    const rebuildLine = (completed: string) => {
      const updatedTokens = [...tokens.slice(0, -1), completed];

      return updatedTokens.join(" ");
    };

    // single match
    if (matches.length === 1) {
      this.tabPressedCount = 0;

      const match = matches[0];

      const completed =  match + " ";

      return [[rebuildLine(completed)], line];
    }

    // multiple matches
    const lcp = getLongestCommonPrefix(matches);

    // expand to longest common prefix
    if (lcp.length > currentToken.length) {
      this.tabPressedCount = 0;

      return [[rebuildLine(lcp)], line];
    }

    // first TAB after max expansion
    if (this.tabPressedCount === 0) {
      this.tabPressedCount++;

      ringBell();

      return [[], line];
    }

    // second TAB → show suggestions
    this.tabPressedCount = 0;

    renderSuggestions(matches, line);

    return [[], line];
  }
}
