---
title: Banner Images
tags:
  - feature
  - component
---

# Banner Images

The BannerImage component provides seamless integration with Obsidian's banner system, displaying hero/banner images at the top of content pages. It supports both Obsidian's wiki-link format and standard image paths, with graceful fallback for missing images.

## Overview

Banner images enhance visual appeal and provide context for content pages. The component is designed to work identically with how Obsidian handles banner images through plugins like [Obsidian Banners](https://github.com/noatpad/obsidian-banners), ensuring consistency between your Obsidian vault and published Quartz site.

## Configuration

### Frontmatter Properties

The component checks for banner images in the following order:

1. **`banner`** - Primary property (Obsidian standard)
2. **`image`** - Legacy fallback property

### Supported Formats

#### Obsidian Wiki-link Format
```yaml
---
banner: "![[attachments/my-banner.webp]]"
---
```

#### Direct Path Format
```yaml
---
banner: "attachments/my-banner.webp"
---
```

#### External URL Format
```yaml
---
banner: "https://example.com/banner-image.jpg"
---
```

#### Legacy Format (Backward Compatible)
```yaml
---
image: "path/to/image.png"
---
```

## How It Works

### Image Resolution

1. **Wiki-link Parsing**: Extracts paths from Obsidian's `![[...]]` format
2. **Path Resolution**: Converts relative paths to proper web URLs
3. **External URLs**: Preserves external URLs without modification
4. **Graceful Failure**: Returns null if image doesn't exist or no banner is specified

### Integration with Type-Aware Layouts

The BannerImage component is integrated into the artifact page layout using ConditionalRender:

```typescript
Component.ConditionalRender({
  component: Component.BannerImage(),
  condition: (props) => {
    const banner = props.fileData.frontmatter?.banner
    const image = props.fileData.frontmatter?.image
    return !!(banner || image)
  }
})
```

This ensures the banner only renders when an image is actually specified.

## Styling

The component applies the following CSS classes:

- `.banner-image` - Container div for the banner
- `.banner-image img` - The image element itself

### Default Styles

```css
.banner-image {
  width: 100%;
  margin: 1rem 0 0.5rem 0;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.banner-image img {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
  display: block;
}
```

### Mobile Responsive

On mobile devices (< 800px width):
- Reduced margins and border radius
- Maximum height limited to 250px

## Usage Examples

### Pattern with Banner
```markdown
---
title: "Multistakeholder Governance"
type: pattern
banner: "![[attachments/governance-banner.webp]]"
tags:
  - governance
  - coordination
---

Content here...
```

### Article with External Banner
```markdown
---
title: "Reimagining Power"
type: article
banner: "https://images.example.com/article-hero.jpg"
description: "How Web3 transforms impact"
---

Article content...
```

### Fallback to Legacy Format
```markdown
---
title: "Legacy Content"
image: "images/old-banner.png"
---

This still works for backward compatibility...
```

## File Organization

### Recommended Structure
```
content/
├── attachments/        # Obsidian attachments folder
│   ├── banners/       # Optional subfolder for banner images
│   └── *.webp         # Image files
├── artifacts/
│   └── articles/
│       └── my-article.md
```

### Path Resolution

- Paths are resolved relative to the content directory
- Leading slashes are automatically removed
- The component uses Quartz's `resolveRelative` utility for proper URL generation

## Component Location

- **Component**: `quartz/components/BannerImage.tsx`
- **Emitter Integration**: `quartz/plugins/emitters/artifactPage.tsx`
- **Export**: `quartz/components/index.ts`

## Compatibility

### Obsidian Plugins
- Fully compatible with [Obsidian Banners](https://github.com/noatpad/obsidian-banners)
- Supports standard Obsidian attachment handling
- Preserves wiki-link format parsing

### Quartz Integration
- Works with type-aware layout system
- Integrated with ConditionalRender for graceful degradation
- Compatible with all content types (artifacts, references, notes)

## Performance

- Images load with `loading="eager"` for above-the-fold content
- Proper aspect ratios maintained with `object-fit: cover`
- Maximum height constraints prevent layout shift

## Limitations

- Does not support Obsidian's `banner_x` and `banner_y` positioning properties (Obsidian-only features)
- Image existence validation occurs at build time only
- No runtime fallback image support (by design for clean degradation)

## Related

- [[type-aware layouts]] - Integration with layout system
- [[Obsidian compatibility]] - General Obsidian feature support
- [[ArtifactPage]] - Primary emitter using BannerImage