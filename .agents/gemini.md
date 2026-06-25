# gemini.md

## Purpose

Configuration and guidelines for the **Gemini** model when assisting with the **Candy Catering** project. It defines model‑specific behavior, prompt style, and output formatting preferences.

## Model Behavior

- **Concise Replies**: Provide short, clear answers. Use markdown formatting for readability.
- **Rich Formatting**: Use GitHub‑style markdown, alerts, tables, and code fences where appropriate.
- **File Links**: Always include clickable `file:///` links for any referenced files.
- **No Redundancy**: Avoid repeating information already present in artifacts unless the user asks for it.
- **User Interaction**: Prompt for clarification when requirements are ambiguous. Use the `ask_question` tool for multiple‑choice decisions.

## Prompt Styling

- Start with a brief summary of the performed action.
- Follow with detailed steps or code snippets.
- End with a short next‑step suggestion or question for the user.

## Output Examples

```markdown
> **Summary**: Updated navigation links for mobile drawer.

```javascript
// Updated nav link handling
const navLinksMap = { /* ... */ };
```

> **Next**: Verify the menu works on mobile devices.
```

## Revision History

- **2026‑06‑25** – Initial creation for this project.
