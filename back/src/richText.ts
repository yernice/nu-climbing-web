import {
  BlockquoteFeature,
  BoldFeature,
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  StrikethroughFeature,
  UnderlineFeature,
  UnorderedListFeature,
  UploadFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { LinkHTMLConverter, convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'
import type { Field, FieldHook, PayloadRequest } from 'payload'

// The editor for long texts (posts, projects, events): like Google Docs, with a toolbar.
// Pasting from a web page or Google Docs keeps headings, lists, links and tables.
export const bodyEditor = lexicalEditor({
  features: () => [
    ParagraphFeature(),
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    StrikethroughFeature(),
    LinkFeature({ enabledCollections: ['posts', 'projects', 'events', 'courses'] }),
    UnorderedListFeature(),
    OrderedListFeature(),
    BlockquoteFeature(),
    HorizontalRuleFeature(),
    UploadFeature(),
    EXPERIMENTAL_TableFeature(),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
})

// Links to other content point at the React site's pages (relative, so they work on any domain).
const sitePaths: Record<string, string> = {
  posts: '/blog',
  projects: '/projects',
  events: '/events',
  courses: '/learning',
}

type LexicalNode = {
  type?: string
  children?: LexicalNode[]
  relationTo?: string
  value?: unknown
  [key: string]: unknown
}
type EditorState = { root: LexicalNode }

// Images inside the text are stored as ids. The HTML converter needs the image itself (address,
// size), so load each one once before converting.
async function withImages(state: EditorState, req: PayloadRequest): Promise<EditorState> {
  const cache = new Map<string, unknown>()
  const fill = async (node: LexicalNode): Promise<LexicalNode> => {
    let value = node.value
    if (node.type === 'upload' && node.relationTo && (typeof value === 'number' || typeof value === 'string')) {
      const key = `${node.relationTo}:${value}`
      if (!cache.has(key)) {
        const doc = await req.payload
          .findByID({ collection: node.relationTo as 'media', id: value, depth: 0, disableErrors: true })
          .catch(() => null)
        cache.set(key, doc)
      }
      value = cache.get(key) ?? value
    }
    const children = node.children ? await Promise.all(node.children.map(fill)) : undefined
    return { ...node, value, ...(children ? { children } : {}) }
  }
  return { ...state, root: await fill(state.root) }
}

const isEditorState = (value: unknown): value is EditorState =>
  typeof value === 'object' && value !== null && 'root' in value

const escapeHTML = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// HTML for the site. Text is escaped and link addresses cleaned by Payload's converter,
// so it is safe to show as HTML.
const toHTML: FieldHook = async ({ siblingData, req }) => {
  const body = siblingData?.body
  if (typeof body === 'string') return body.split(/\n\s*\n/).map((p) => `<p>${escapeHTML(p.trim())}</p>`).join('')
  if (!isEditorState(body)) return ''
  return convertLexicalToHTML({
    data: (await withImages(body, req)) as never,
    disableContainer: true,
    converters: ({ defaultConverters }) => ({
      ...defaultConverters,
      ...LinkHTMLConverter({
        internalDocToHref: ({ linkNode }) => {
          const doc = linkNode.fields.doc
          const id = typeof doc?.value === 'object' ? doc.value?.id : doc?.value
          const base = doc ? sitePaths[doc.relationTo] : undefined
          return base && id !== undefined ? `${base}/${id}` : '#'
        },
      }),
    }),
  })
}

// Plain text with paragraphs separated by an empty line: for card previews on the site.
const toText: FieldHook = ({ siblingData }) => {
  const body = siblingData?.body
  if (typeof body === 'string') return body
  if (!isEditorState(body)) return ''
  return convertLexicalToPlaintext({
    data: body as never,
    // Quotes are their own paragraph (the converter only separates paragraphs, headings, lists, tables).
    converters: {
      quote: ({ node, nodesToPlaintext }) => '\n\n' + nodesToPlaintext({ nodes: node.children ?? [] }).join(''),
    },
  }).trim()
}

// Plain text (paragraphs separated by an empty line) in the editor's format, e.g. for seed data.
export function plainToRichText(text: string) {
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: paragraphs.map((p) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        textFormat: 0,
        children: [{ type: 'text', text: p, format: 0, style: '', mode: 'normal', detail: 0, version: 1 }],
      })),
    },
  }
}

// The text field of posts, projects and events, plus two read-only versions the site uses.
export const bodyFields = (label = 'Text'): Field[] => [
  { name: 'body', label, type: 'richText', required: true, editor: bodyEditor },
  { name: 'bodyHtml', type: 'text', virtual: true, admin: { hidden: true }, hooks: { afterRead: [toHTML] } },
  { name: 'bodyText', type: 'text', virtual: true, admin: { hidden: true }, hooks: { afterRead: [toText] } },
]
