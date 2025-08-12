---
title: "ArtifactPage"
tags:
  - plugin/emitter
---

This plugin generates individual pages for content in the 'artifact' category using type-aware layouts and components. It works as part of the [[type-aware layouts]] system.

> [!note]
> For information on how to add, remove or configure plugins, see the [[configuration#Plugins|Configuration]] page.

## Behavior

- **Processes**: Files with `typeCategory === 'artifact'`
- **Uses**: `TypeAwareArtifactContent` component for type-specific rendering
- **Handles**: All artifact types without exceptions

## Supported Types

- **pattern** - Reusable organizational solutions  
- **playbook** - Step-by-step implementation guides
- **study** - Real-world analysis and case studies
- **article** - In-depth explorations
- **guide** - Comprehensive references
- **protocol** - Systematic procedures

## Type-Aware Rendering

Each artifact type gets specialized markup with icons and descriptions:

```tsx
// Example: Pattern type  
<article class="type-pattern category-artifact inherits-note inherits-artifact">
  <div class="artifact-header pattern-header">
    <span class="artifact-type-badge pattern-badge">⚡ Pattern</span>
    <span class="artifact-description">Reusable organizational solution</span>
  </div>
  {content}
</article>
```

## Type Icons & Descriptions

| Type | Icon | Description |
|------|------|-------------|
| pattern | ⚡ | Reusable organizational solution |
| playbook | 📖 | Step-by-step implementation guide |
| study | 🔍 | Real-world analysis and insights |
| article | 📄 | In-depth exploration |
| guide | 🗺️ | Comprehensive reference |
| protocol | ⚙️ | Systematic procedure |

## Configuration

```typescript
// quartz.config.ts
emitters: [
  Plugin.ContentPage(),   // Fallback
  Plugin.ArtifactPage(),  // Artifact category
  // ...
]
```

## CSS Classes

Each page gets comprehensive CSS classes for styling:
- `type-{typeName}` - Specific type (e.g., `type-pattern`)
- `category-artifact` - Category classification
- `inherits-{parent}` - Each parent in inheritance chain

## API

- Category: Emitter
- Function name: `Plugin.ArtifactPage()`.
- Source: [`quartz/plugins/emitters/artifactPage.tsx`](https://github.com/jackyzha0/quartz/blob/v4/quartz/plugins/emitters/artifactPage.tsx).
- Component: [`quartz/components/TypeAwareArtifactContent.tsx`](https://github.com/jackyzha0/quartz/blob/v4/quartz/components/TypeAwareArtifactContent.tsx).

## Related

- [[type-aware layouts]] - The complete type-aware system
- [[TypeDetection]] - Transformer that detects content types  
- [[ReferencePage]] - Emitter for reference category types