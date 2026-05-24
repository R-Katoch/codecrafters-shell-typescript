import { getAllCommands } from "../commands";
import { getLongestCommonPrefix } from "./lcp";
import { getMatches } from "./matcher";
import {
  renderSuggestions,
  ringBell,
} from "./renderer";

export class CompletionEngine {
  private tabPressedCount = 0;

  complete(
    line: string,
  ): [string[], string] {
    const commands = getAllCommands();
    const matches = getMatches(
      line,
      commands,
    );

    // no matches
    if (matches.length === 0) {
      this.tabPressedCount = 0;

      ringBell();

      return [[], line];
    }

    // single match
    if (matches.length === 1) {
      this.tabPressedCount = 0;

      return [
        [matches[0] + " "],
        line,
      ];
    }

    // multiple matches
    const lcp =
      getLongestCommonPrefix(matches);

    // expand to LCP
    if (lcp.length > line.length) {
      this.tabPressedCount = 0;

      return [[lcp], line];
    }

    // first TAB after max expansion
    if (this.tabPressedCount === 0) {
      this.tabPressedCount++;

      ringBell();

      return [[], line];
    }

    // second TAB
    this.tabPressedCount = 0;

    renderSuggestions(matches, line);

    return [[], line];
  }
}