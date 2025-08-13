# SuperBenefit's Knowledge Garden

> "[One] who works with the door open gets all kinds of interruptions, but [they] also occasionally gets clues as to what the world is and what might be important." — Richard Hamming

Knowledge from the SuperBenefit community and its projects is stored here. You can use this space to learn, record and share what matters to you in your journey with SuperBenefit.

## Using This Repo

This repo is maintained using [Obsidian](https://obsidian.md/) and published using [Quartz](https://github.com/jackyzha0/quartz). Quartz is a set of tools that helps you publish your [digital garden](https://jzhao.xyz/posts/networked-thought) and notes as a website for free.
Quartz v4 features a from-the-ground rewrite focusing on end-user extensibility and ease-of-use.

🔗 Check out the [docs](/docs/) directory or the official [Quartz documentation](https://quartz.jzhao.xyz/) to learn more.

## Customizations

This repository extends the default Quartz v4 template with several custom features and modifications tailored for the SuperBenefit Knowledge Garden.

### 🎨 Type-Aware Layout System
**Files:** `quartz/types/`, `quartz/plugins/emitters/artifactPage.tsx`, `quartz/plugins/emitters/referencePage.tsx`  
**Commits:** [5212cb11](../../commit/5212cb11), [30cab1af](../../commit/30cab1af), [3dab4957](../../commit/3dab4957)

A sophisticated content management system that automatically applies different page layouts based on content type detection:
- **Dynamic Type Loading**: Loads type definitions from `content/tools/types/*.md` (Obsidian Metadata Menu format)
- **Type Hierarchy**: Supports inheritance (`note` → `artifact`/`reference` → specific types)
- **Category-Based Routing**: Routes content to specialized emitters based on type category
- **Graceful Fallback**: Unknown types fall back to default Quartz layouts
- **TypeBadge Component**: Visual indicators for content types (⚡ Pattern, 📖 Playbook, etc.)

### 📚 Citation Management
**Files:** `quartz/components/CitationGenerator.tsx`, `quartz/components/CitationStyles.ts`, `quartz/components/CitationExports.ts`  
**Purpose:** Academic citation generation and management

Comprehensive citation system supporting multiple academic formats:
- **Multiple Styles**: APA, MLA, Chicago, IEEE, and Harvard citation formats
- **Export Options**: Copy to clipboard, download as BibTeX, or export as formatted text
- **Frontmatter Integration**: Automatically generates citations from page metadata
- **Smart Formatting**: Handles author lists, dates, URLs, and DOIs intelligently

### 📜 License Information Display
**Files:** `quartz/components/LicenseInfo.tsx`  
**Purpose:** Creative Commons license visualization

Visual license display component:
- **CC License Icons**: Displays appropriate Creative Commons license badges
- **License Links**: Direct links to license deeds
- **Frontmatter-Driven**: Reads license info from page metadata
- **Visual Clarity**: Clean, recognizable CC iconography

### 🎯 Custom Header Navigation
**Files:** `quartz/components/Header.tsx`  
**Purpose:** Customized site navigation

Enhanced header with SuperBenefit-specific navigation:
- **Custom Links**: Direct links to Artifacts, Projects, Lexicon, and Library sections
- **Responsive Design**: Mobile-friendly navigation
- **Configurable**: Easy to modify links and structure

### 🖼️ Banner Images
**Files:** `quartz/components/BannerImage.tsx`  
**Purpose:** Obsidian-compatible banner/hero images

Seamless integration with Obsidian's banner system:
- **Obsidian Wiki-link Support**: Parses `banner: "![[attachments/image.webp]]"` format
- **Multiple Formats**: Supports wiki-links, direct paths, and external URLs
- **Graceful Fallback**: Conditionally renders only when images are specified
- **Legacy Support**: Falls back to `image` property for backward compatibility
- **Responsive Design**: Optimized display for desktop and mobile devices

### 🎨 Visual Customization
**Files:** `quartz.config.ts`  
**Configuration Changes:**

- **Custom Fonts**: 
  - Header: Schibsted Grotesk
  - Body: Source Sans Pro
  - Code: IBM Plex Mono
- **SuperBenefit Branding**:
  - Custom color scheme for light/dark modes
  - Footer links to Twitter, Discord, and Mirror
- **Analytics**: Plausible analytics integration

### 📁 Content Organization
**Structure Additions:**

- **Type Definitions**: `content/tools/types/` - Dynamic type system definitions
- **Artifacts**: Validated knowledge (patterns, playbooks, studies, articles, guides)
- **References**: Organizational content (links, tags, indices)
- **Notes**: Work-in-progress and exploratory content

### 🔧 Build Configuration
**Files:** `quartz.config.ts`  
**Plugin Order:**

1. **FrontMatter** (required first)
2. **TypeDetection** (custom transformer)
3. **ContentPage** (fallback emitter)
4. **ReferencePage** & **ArtifactPage** (category emitters)
5. Standard Quartz emitters (FolderPage, TagPage, etc.)

### 📖 Documentation
**Files:** `docs/features/type-aware layouts.md`, `docs/plugins/`, `CLAUDE.md`

Comprehensive documentation including:
- Feature documentation with mermaid diagrams
- Plugin documentation for custom emitters
- Development guidelines in CLAUDE.md
- File organization index

### 🛠️ Developer Experience
**Files:** `CLAUDE.md`  
**Improvements:**

- Clear project instructions for AI assistants
- Emphasis on leveraging built-in Quartz functionality
- File organization conventions
- Debugging tips and common patterns

---

All customizations maintain full backward compatibility with Quartz v4 and follow established Quartz patterns and conventions. The type-aware system gracefully degrades for undefined types, ensuring robust operation.
