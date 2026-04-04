---
slug: debug-markdown-harness
title: Debug Markdown Harness
description: A dev-only post for checking the visual treatment of common markdown elements.
pubDate: 2026-04-04
debugOnly: true
---

# Heading One

This dev-only post exists to check the rendering of **strong text**, *emphasis*, ~~strikethrough~~, inline code like `const ready = true`, and [links](https://example.com).

## Heading Two

Here is a paragraph with a manual line break at the end of this sentence.  
The next line should still belong to the same thought.

### Heading Three

> Blockquotes should feel distinct without getting too loud.
>
> This second line helps confirm spacing.

Unordered list:

- First item
- Second item
- Third item with `inline snippets`

Ordered list:

1. Gather the markdown source.
2. Render it through the blog layout.
3. Confirm spacing, typography, and code treatment.

#### Heading Four

Horizontal rule below:

---

Table:

| Element | What to verify |
| --- | --- |
| Headings | Scale and spacing |
| Lists | Indentation and rhythm |
| Code | Font, padding, and overflow |

Python example:

```python
from dataclasses import dataclass


@dataclass
class PostStats:
    words: int
    code_blocks: int


def estimate_read_time(words: int, words_per_minute: int = 220) -> int:
    return max(1, (words + words_per_minute - 1) // words_per_minute)


stats = PostStats(words=420, code_blocks=2)
print(f"{estimate_read_time(stats.words)} min read")
```

JavaScript example:

```js
const sections = ["headings", "lists", "quotes", "code"];

function summarize(elements) {
  return elements.map((name, index) => `${index + 1}. ${name}`).join("\n");
}

console.log(summarize(sections));
```

JSON example:

```json
{
  "title": "Debug Markdown Harness",
  "debugOnly": true,
  "visibleInDev": true
}
```

##### Heading Five

Image syntax without an actual asset:

![Placeholder alt text](https://placehold.co/960x320/png)

###### Heading Six

Final checklist:

- Paragraph spacing looks even
- Code fences scroll on small screens
- Links, blockquotes, and tables feel intentional
