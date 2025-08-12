---
title: "ReferencePage" 
tags:
  - plugin/emitter
---

This plugin generates individual pages for content in the 'reference' category using type-specific layouts. It works as part of the [[type-aware layouts]] system while gracefully coexisting with existing TagPage and FolderPage emitters.

> [!note]
> For information on how to add, remove or configure plugins, see the [[configuration#Plugins|Configuration]] page.

## Behavior

- **Processes**: Files with `typeCategory === 'reference'`
- **Skips**: `tag` and `index` types (handled by [[TagPage]] and [[FolderPage]])
- **Uses**: `getLayoutForType()` to select appropriate page layouts per file type

## Supported Types

- **link** - External resources and references
- **reference** - General reference material  
- **index** - ❌ Skipped (handled by FolderPage)
- **tag** - ❌ Skipped (handled by TagPage)

## Layout Selection

Similar to ArtifactPage, dynamically selects layouts:

```typescript
// Skip types handled by other emitters
if (detectedType === "tag" || detectedType === "index") {
  continue // TagPage and FolderPage emitters handle these
}

// Get type-specific layout or fall back
const typeLayout = getLayoutForType(detectedType)
const layoutOpts = typeLayout ? {
  ...sharedPageComponents,
  ...typeLayout,
  pageBody: Content(),
  ...userOpts,
} : defaultOpts
```

## Page Structure Control

Reference types can have customized page layouts:

- **beforeBody**: TypeBadge component for reference types
- **left**: Custom Explorer showing only reference content
- **right**: Extended graph depth for relationship visualization
- **pageBody**: Standard Content component

## Graceful Coexistence

The emitter carefully avoids conflicts with existing Quartz features:

- **TagPage**: Processes tag files and generates tag listing pages (unchanged)
- **FolderPage**: Processes index files and generates folder listings (unchanged)
- **ReferencePage**: Only processes link/reference types, skips tag/index entirely

## Configuration

```typescript
// quartz.config.ts  
emitters: [
  Plugin.ContentPage(),    // Fallback for note types
  Plugin.ReferencePage(), // Reference category processing
  Plugin.ArtifactPage(),  // Artifact category processing
  Plugin.TagPage(),       // Handles tag types (unchanged)
  Plugin.FolderPage(),    // Handles index types (unchanged)  
  // ...
]
```

## Processing Order

The emitter integrates seamlessly into Quartz's processing pipeline without requiring specific ordering constraints.

## API

- Category: Emitter
- Function name: `Plugin.ReferencePage()`.  
- Source: [`quartz/plugins/emitters/referencePage.tsx`](https://github.com/jackyzha0/quartz/blob/v4/quartz/plugins/emitters/referencePage.tsx).

## Related

- [[type-aware layouts]] - The complete type-aware system
- [[TypeDetection]] - Transformer that detects content types
- [[ArtifactPage]] - Emitter for artifact category types
- [[TagPage]] - Handles tag type files (unchanged)
- [[FolderPage]] - Handles index type files (unchanged)