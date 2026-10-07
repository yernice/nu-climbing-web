const INTRO_LENGTH = 150

// Short excerpt from the first paragraph of a post, cut on a word boundary.
export function makeIntro(paragraphs, length = INTRO_LENGTH) {
    const text = paragraphs[0] ?? ""
    if (text.length <= length) return text
    return text.slice(0, length).replace(/\s+\S*$/, "") + "…"
}
