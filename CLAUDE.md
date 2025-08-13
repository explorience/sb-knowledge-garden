# Claude Project Instructions

## Project Overview
This is a Quartz 4 static site generator project for the SuperBenefit Knowledge Garden. Quartz is built on top of Hugo and uses TypeScript/React for components.

## Key Principles

### 1. Leverage Built-in Quartz Functionality First
**IMPORTANT**: Always look for and use existing Quartz features before creating custom solutions.

- Check for existing Quartz components and utilities before building new ones
- Use built-in conditional rendering (e.g., `Component.MobileOnly`, `Component.DesktopOnly`)
- Leverage existing layout patterns and component composition
- Reference Quartz documentation at https://quartz.jzhao.xyz/ for available features
- Prefer configuration over customization when possible

### 2. File Organization Conventions
All source code must follow Quartz's directory structure:
- **Components**: `quartz/components/`
- **Plugins**: `quartz/plugins/` (with subdirectories for `emitters/`, `transformers/`, `filters/`)
- **Types and utilities**: `quartz/types/`, `quartz/util/`
- **Configuration**: `quartz/cfg/`
- **Styles**: `quartz/styles/` (Sass files)
- **Never place source files in the project root** (except `quartz.config.ts` and `quartz.layout.ts`)

### 3. Type-Aware Layouts System
This project implements a custom type-aware layout system that extends Quartz:
- Type definitions are loaded from `content/tools/types/*.md` (Obsidian Metadata Menu format)
- Types follow an inheritance hierarchy: `note` → `artifact`/`reference` → specific types
- Each type can have custom layouts defined in `quartz/types/typeLayouts.ts`
- The system gracefully falls back: specific type → category layout → default layout

Key files:
- `quartz/types/typeRegistry.ts` - Type management
- `quartz/types/typeLoader.ts` - Dynamic type loading
- `quartz/types/typeLayouts.ts` - Layout definitions
- `quartz/plugins/transformers/typeDetection.ts` - Type detection
- `quartz/plugins/emitters/artifactPage.tsx` - Artifact emitter
- `quartz/plugins/emitters/referencePage.tsx` - Reference emitter

### 4. Plugin Development
When creating or modifying plugins:
- Transformers must be ordered correctly (e.g., `FrontMatter` before `TypeDetection`)
- Emitters process content in order - later emitters can override earlier ones
- Always return proper QuartzPlugin types
- Use the plugin pattern: factory function returning plugin object

### 5. Component Development
When creating components:
- Follow the QuartzComponent and QuartzComponentConstructor patterns
- Components can access `fileData`, `cfg`, `allFiles`, and other props
- Use `displayClass` prop for responsive design classes
- Always export using the satisfies pattern: `export default (() => Component) satisfies QuartzComponentConstructor`

### 6. Testing and Building
- Run `npx quartz build` to test changes
- Use `npx quartz build --serve` for local development with hot reload
- Check console output for type detection and emitter processing logs
- Verify that type detection is working by checking console logs for `[TypeDetection]` messages

### 7. Documentation
- Main feature documentation goes in `docs/features/`
- Plugin documentation goes in `docs/plugins/`
- Always update documentation when adding new features
- Include file indexes and clear examples

## Common Patterns

### Conditional Rendering
```typescript
// Use built-in responsive components
Component.DesktopOnly(Component.Explorer())
Component.MobileOnly(Component.Spacer())

// For custom conditions, create wrapper components
const ConditionalComponent: QuartzComponent = (props) => {
  if (condition) {
    return <ActualComponent {...props} />
  }
  return null
}
```

### Type-Aware Components
```typescript
// Access type information from fileData
const detectedType = fileData.detectedType
const typeCategory = fileData.typeCategory
```

### Layout Customization
```typescript
// Define layouts in quartz/types/typeLayouts.ts
export const customLayout: PageLayout = {
  beforeBody: [...],
  left: [...],
  right: [...]
}
```

## Project-Specific Notes

1. **TypeBadge Component**: Currently the only type-aware visual customization, displays badges like "⚡ Pattern" or "📖 Playbook"

2. **Note Type Bypass**: Files with type "note" or no type completely bypass the type-aware system and use default Quartz behavior

3. **Graceful Fallback**: The system is designed to fail gracefully - unknown types fall back to note layouts

4. **Dynamic Type Loading**: Type definitions are loaded from content files at build time, with hardcoded fallbacks for reliability

## Debugging Tips

- Set `NODE_ENV=development` to see detailed type detection logs
- Check emitter output with messages like `[ArtifactPage] Processed X files`
- Use `console.log` in transformers and emitters to debug processing
- Verify file paths in type definitions match actual content structure

## Important Links

- Quartz Documentation: https://quartz.jzhao.xyz/
- Quartz GitHub: https://github.com/jackyzha0/quartz
- Project Repository: https://github.com/superbenefit/knowledge-garden