---
title: "ArtifactPage"
tags:
  - plugin/emitter
---

This plugin generates individual pages for content in the 'artifact' category using type-specific layouts. It works as part of the [[type-aware layouts]] system to provide different page structures based on content type.

> [!note]
> For information on how to add, remove or configure plugins, see the [[configuration#Plugins|Configuration]] page.

## Behavior

- **Processes**: Files with `typeCategory === 'artifact'`
- **Uses**: `getLayoutForType()` to select appropriate page layouts per file type
- **Handles**: All artifact types with graceful fallback to category defaults

## Supported Types

- **pattern** - Reusable organizational solutions  
- **playbook** - Step-by-step implementation guides
- **study** - Real-world analysis and case studies
- **article** - In-depth explorations
- **guide** - Comprehensive references
- **protocol** - Systematic procedures

## Layout Selection

The emitter dynamically selects layouts based on detected type:

```typescript
// Gets type-specific layout (e.g., patternLayout) 
// or falls back to artifactLayout for unknown types
const typeLayout = getLayoutForType(detectedType)
const layoutOpts = typeLayout ? {
  ...sharedPageComponents,
  ...typeLayout,
  pageBody: Content(),
  ...userOpts,
} : defaultOpts
```

## Page Structure Control

Each type can have completely different page structures:

- **beforeBody**: Different components above content (TypeBadge, etc.)
- **left**: Custom Explorer configurations, different filters per type
- **right**: Different combinations of Graph, TOC, Backlinks
- **pageBody**: Standard Content component (same for all types)

Example: Pattern pages show only pattern files in Explorer, while Study pages show all studies.

## Configuration

```typescript
// quartz.config.ts
emitters: [
  Plugin.ContentPage(),   // Fallback for note types
  Plugin.ArtifactPage(),  // Artifact category processing
  Plugin.ReferencePage(), // Reference category processing
  // ...
]
```

## Type Icons & Styling

Type badges are displayed via the TypeBadge component:

| Type | Badge | Notes |
|------|-------|-------|
| pattern | ⚡ Pattern | Shows in beforeBody section |
| playbook | 📖 Playbook | Customizable per layout |
| study | 🔍 Case Study | Returns null for note types |
| article | 📄 Article | Only shows for artifact/reference types |
| guide | 🗺️ Guide | - |
| protocol | ⚙️ Protocol | - |

## API

- Category: Emitter
- Function name: `Plugin.ArtifactPage()`.
- Source: [`quartz/plugins/emitters/artifactPage.tsx`](https://github.com/jackyzha0/quartz/blob/v4/quartz/plugins/emitters/artifactPage.tsx).

## Related

- [[type-aware layouts]] - The complete type-aware system
- [[TypeDetection]] - Transformer that detects content types  
- [[ReferencePage]] - Emitter for reference category types
- [`typeLayouts.ts`] - Layout definitions for each type