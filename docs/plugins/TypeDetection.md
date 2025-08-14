---
title: "TypeDetection"
tags:
  - plugin/transformer
last_updated: 2024-01-15
quartz_version: "4.x"
---

This plugin detects content types and attaches type metadata to files for use by category emitters. It enables the [[type-aware layouts]] feature by analyzing content frontmatter, file paths, and Obsidian metadata.

> [!note]
> For information on how to add, remove or configure plugins, see the [[configuration#Plugins|Configuration]] page.

## Features

- **Dynamic type loading** from `content/tools/types/*.md` files with single-pass optimization
- **Multiple detection methods** with priority order
- **Inheritance chain resolution** for type hierarchies  
- **Category classification** (reference/artifact/note)
- **Robust error handling** with graceful fallback to note type
- **Graceful fallback** to hardcoded types if loading fails
- **Development logging** for debugging type detection issues

## Detection Priority

1. **Explicit frontmatter**: `type: "pattern"`
2. **Obsidian fileClass**: `fileClass: "pattern"`  
3. **Directory-based**: `/artifacts/patterns/` → `pattern`

## Type Metadata Added

For each processed file, the plugin adds:

```typescript
file.data.detectedType = "pattern"                    // Detected type name
file.data.typeCategory = "artifact"                   // Category classification  
file.data.typeInheritanceChain = ["note", "artifact", "pattern"]  // Full chain
file.data.typeClasses = "type-pattern category-artifact inherits-note inherits-artifact"
```

## Type Definitions

Type definitions are loaded from `content/tools/types/*.md` files with frontmatter:

```yaml
---
extends: artifact      # Parent type (optional)
icon: layout-template  # Icon identifier
filesPaths:           # Directory paths for detection
  - artifacts/patterns
tagNames:             # Associated tags (optional)
  - patterns
---
Description of the pattern type...
```

## Configuration

```typescript
// quartz.config.ts
transformers: [
  Plugin.TypeDetection(), // Must come after FrontMatter plugin
  // ...
]
```

## Integration

Works with category emitters:
- **ContentPage** - Fallback for untyped content
- **ReferencePage** - Processes reference category types
- **ArtifactPage** - Processes artifact category types

Gracefully skips types handled by purpose-built emitters (TagPage, FolderPage).

## API

- Category: Transformer
- Function name: `Plugin.TypeDetection()`.
- Source: [`quartz/plugins/transformers/typeDetection.ts`](https://github.com/jackyzha0/quartz/blob/v4/quartz/plugins/transformers/typeDetection.ts).

## Related

- [[type-aware layouts]] - The feature enabled by this plugin
- [[ReferencePage]] - Emitter for reference category types  
- [[ArtifactPage]] - Emitter for artifact category types