---
title: "ReferencePage" 
tags:
  - plugin/emitter
---

This plugin generates individual pages for content in the 'reference' category using type-aware layouts and components. It works as part of the [[type-aware layouts]] system.

> [!note]
> For information on how to add, remove or configure plugins, see the [[configuration#Plugins|Configuration]] page.

## Behavior

- **Processes**: Files with `typeCategory === 'reference'`
- **Skips**: `tag` and `index` types (handled by [[TagPage]] and [[FolderPage]])
- **Uses**: `TypeAwareReferenceContent` component for type-specific rendering

## Supported Types

- **link** - External resources and references
- **reference** - General reference material  
- **index** - ❌ Skipped (handled by FolderPage)
- **tag** - ❌ Skipped (handled by TagPage)

## Type-Aware Rendering  

Each reference type gets specialized markup:

```tsx
// Example: Link type
<article class="type-link category-reference">
  <div class="reference-header link-header">
    <span class="reference-type-badge">External Resource</span>
  </div>
  {content}
</article>
```

## Configuration

```typescript
// quartz.config.ts  
emitters: [
  Plugin.ContentPage(),    // Fallback
  Plugin.ReferencePage(), // Reference category
  Plugin.TagPage(),       // Handles tag types  
  Plugin.FolderPage(),    // Handles index types
  // ...
]
```

## Emitter Order

Must come **after** ContentPage (fallback) and **before** TagPage/FolderPage to maintain proper processing order.

## API

- Category: Emitter
- Function name: `Plugin.ReferencePage()`.  
- Source: [`quartz/plugins/emitters/referencePage.tsx`](https://github.com/jackyzha0/quartz/blob/v4/quartz/plugins/emitters/referencePage.tsx).
- Component: [`quartz/components/TypeAwareReferenceContent.tsx`](https://github.com/jackyzha0/quartz/blob/v4/quartz/components/TypeAwareReferenceContent.tsx).

## Related

- [[type-aware layouts]] - The complete type-aware system
- [[TypeDetection]] - Transformer that detects content types
- [[ArtifactPage]] - Emitter for artifact category types
- [[TagPage]] - Handles tag type files  
- [[FolderPage]] - Handles index type files