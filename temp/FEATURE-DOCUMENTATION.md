# Release-Focused Artifacts Structure - Feature Documentation

**Branch**: `claude/store-published-works-01TRxEUhZfQqxuRjE1pGg8pR`
**Date**: 2025-01-18
**Status**: ⚠️ INCOMPLETE - Requires source repository reorganization

## Executive Summary

This branch implements a release-focused organization system for knowledge artifacts, shifting from type-based categorization (articles, patterns, playbooks, etc.) to project/series-based collections (Reimagining Power, DAO Primitives, Governance Futures). The implementation is split between two repositories:

1. **knowledge-garden** (Quartz site) - ✅ COMPLETED
2. **knowledge-base** (source content) - ⚠️ PENDING - User will reorganize locally

## Problem Statement

The original artifacts structure was organized by content type:
```
content/artifacts/
├── articles/
├── patterns/
├── playbooks/
├── studies/
└── guides/
```

This structure made it difficult to:
- Understand complete bodies of work
- Navigate project-specific outputs
- Showcase thematically coherent knowledge packages
- See the relationship between different artifact types in a single initiative

## Solution Overview

Reorganize artifacts around **releases** - curated collections of related work from specific projects, initiatives, or thematic series. Each release becomes a navigational hub containing multiple artifact types.

### Desired End State Structure

```
content/artifacts/
├── index.md (release showcase)
├── reimagining-power/
│   ├── index.md (release hub)
│   ├── article.md
│   ├── playbook.md
│   └── case-studies/
├── dao-primitives/
│   ├── index.md (release hub)
│   ├── framework/
│   ├── patterns/
│   └── network-evolution/
├── governance-futures/
│   ├── index.md (release hub)
│   └── articles/
├── windfall-protocol/
│   └── index.md (placeholder)
└── [standalone artifacts as needed]
```

## Implementation Details

### 1. Type System Extension

#### New Release Type
**Location**: `content/types/release.md`

```yaml
---
icon: package-open
extends: artifact
filesPaths:
  - artifacts/reimagining-power
  - artifacts/dao-primitives
  - artifacts/governance-futures
  - artifacts/windfall-protocol
fields:
  - name: releaseDate
    type: Date
  - name: relatedReleases
    type: MultiFile
---
```

**Integration Points**:
- `quartz/types/typeRegistry.ts` - Added hardcoded fallback
- `quartz/types/typeLoader.ts` - Fixed path from `content/tools/types/` to `content/types/`
- `quartz/types/typeLayouts.ts` - Added placeholder layout (not actively used)

### 2. Custom Components

#### ReleaseCard Component
**Location**: `quartz/components/ReleaseCard.tsx`

Displays individual artifacts as attractive cards with:
- Banner/cover images (with wiki-link support)
- Type badges (with emoji indicators)
- Descriptions (truncated to 3 lines)
- Tags
- Hover effects and responsive grid

**CSS Features**:
- Card hover animations
- Responsive image scaling
- Mobile-friendly layouts
- Grid-based presentation

#### ReleaseContents Component
**Location**: `quartz/components/ReleaseContents.tsx`

Automatically discovers and displays all published artifacts within a release directory:

**Logic**:
1. Extracts current release directory from file slug
2. Filters for published files in that directory/subdirectories
3. Excludes the release index page itself
4. Groups artifacts by type
5. Displays in ordered sections (Articles → Playbooks → Guides → Patterns → Studies)

**Features**:
- Automatic content discovery
- Type-based grouping
- Responsive card grid
- "No content" message for empty releases

### 3. Integration with ArtifactPage Emitter

**Location**: `quartz/plugins/emitters/artifactPage.tsx`

Added conditional rendering for ReleaseContents:

```typescript
afterBody: [
  Component.ConditionalRender({
    component: Component.ReleaseContents(),
    condition: (props) => {
      const type = props.fileData.frontmatter?.type as string | undefined
      return type === 'release'
    }
  }),
  // ... other afterBody components
]
```

This ensures ReleaseContents only renders for pages with `type: release`.

### 4. Component Exports

**Location**: `quartz/components/index.ts`

Added exports:
```typescript
import ReleaseCard from "./ReleaseCard"
import ReleaseContents from "./ReleaseContents"
// ... in exports
ReleaseCard,
ReleaseContents,
```

## Content Migration Performed

### Reimagining Power Release
**Migrated to**: `content/artifacts/reimagining-power/`

- `article.md` ← RPP main article
- `playbook.md` ← RPP playbook
- `case-studies/`:
  - equality-fund.md
  - aifs.md
  - ics.md
  - rpp-governance.md

### DAO Primitives Release
**Migrated to**: `content/artifacts/dao-primitives/`

- `framework/` ← Complete DAO Primitives framework from guides
  - All group-phase, group-scale, group-primitives content
  - Implementation guides
  - Group facilitation
- `patterns/` ← DAO-specific patterns (cell, cell-state, decider-protocol)
- `network-evolution/` ← 5-article series on DAOs as networks

### Governance Futures Release
**Migrated to**: `content/artifacts/governance-futures/`

- `articles/` ← 4 governance conversation articles

### Windfall Protocol
**Created**: `content/artifacts/windfall-protocol/`

- Placeholder index with `publish: false`

## Current Issues & State

### ⚠️ CRITICAL ISSUE: Mixed Directory Structure

The current `content/artifacts/` directory contains both:

**New release folders** (4):
- dao-primitives/
- governance-futures/
- reimagining-power/
- windfall-protocol/

**Old type folders** (5):
- articles/ (1 file: index.md)
- guides/ (3 files: index.md, discord-link-scraper.md, poetic-harvesting-guide.md)
- patterns/ (10 files: various standalone patterns)
- playbooks/ (1 file: index.md)
- studies/ (3 files: remaining indices)

### Why This Is Problematic

1. **Confusing navigation** - Users don't know if they should browse by type or by release
2. **Duplicate index pages** - Both type indices and release indices exist
3. **Unclear organization** - Some content moved to releases, some stayed in type folders
4. **Maintenance burden** - Two organizational paradigms to maintain

### Remaining Standalone Artifacts

**Patterns** (in `content/artifacts/patterns/`):
- fiscal-bridge-pattern.md
- gatherings.md
- knowledge-gardens.md
- poetic-harvesting.md
- progressive-web3-adoption.md
- And others...

**Guides** (in `content/artifacts/guides/`):
- discord-link-scraper.md
- poetic-harvesting-guide.md

These were intentionally left as standalone artifacts per user instruction.

## Design Decisions

### 1. Release Type Extends Artifact
Releases are treated as a special type of artifact, allowing them to:
- Be processed by ArtifactPage emitter
- Use artifact-specific layouts and styling
- Benefit from type detection system

### 2. Automatic Content Discovery
ReleaseContents component automatically discovers content rather than requiring manual curation:
- **Pros**: No maintenance, always up-to-date
- **Cons**: Less control over ordering and featured items
- **Decision**: Automatic with manual description space in release index.md

### 3. AfterBody Placement
ReleaseContents renders in afterBody rather than beforeBody:
- Allows release index.md content to appear first
- Provides context before showing artifact grid
- Separates description from listing

### 4. Conditional Rendering Pattern
Used ConditionalRender wrapper rather than type-specific emitters:
- Keeps all artifacts in one emitter
- Simpler to maintain
- More flexible for future types

### 5. Card-Based UI
Visual card presentation for artifacts:
- More engaging than list format
- Better showcases images and descriptions
- Industry-standard pattern for content galleries

## Build & Test Results

### Build Success
```
[TypeLoader] Successfully loaded 12 type definitions
[TypeRegistry] Dynamic type categories: { release: 'artifact', ... }
[ArtifactPage] Processed 54 artifact files
Done processing 215 files in 10s
```

### Type System Integration
✅ Release type loaded dynamically from `content/types/release.md`
✅ Release categorized as 'artifact'
✅ Release files processed by ArtifactPage emitter
✅ ReleaseContents component renders conditionally

### Component Rendering
✅ ReleaseCard displays with images, descriptions, tags
✅ ReleaseContents groups artifacts by type
✅ Responsive grid layout works
✅ Empty state message displays for windfall-protocol

## Commit History

### Commit 1c1b63a
**Message**: "Restructure artifacts from type-based to release-focused organization"

**Changes** (59 files):
- Added release type system and components
- Created 4 release directories with index pages
- Migrated content from type folders to releases
- Updated main artifacts index
- Fixed typeLoader path bug

**Additions**: +1244 lines
**Deletions**: -275 lines

**Key Files Created**:
- content/types/release.md
- quartz/components/ReleaseCard.tsx
- quartz/components/ReleaseContents.tsx
- content/artifacts/*/index.md (for each release)

**Key Files Modified**:
- quartz/types/typeLoader.ts (path fix)
- quartz/types/typeRegistry.ts (added release)
- quartz/plugins/emitters/artifactPage.tsx (added ReleaseContents)
- content/artifacts/index.md (release showcase)

## Known Issues & Limitations

### 1. Source Repository Mismatch
**Issue**: knowledge-garden reorganized but knowledge-base (source) still has old structure
**Impact**: Sync conflicts, confusion about source of truth
**Resolution**: User must reorganize knowledge-base locally

### 2. Mixed Folder Structure
**Issue**: Old type folders coexist with new release folders
**Impact**: Confusing navigation, unclear organization
**Resolution**: Clean up after source reorganization complete

### 3. Standalone Artifacts Unclear
**Issue**: No clear home for artifacts that don't fit a release
**Current State**: Left in type folders
**Future**: May need "standalone" or "tools" release, or accept mixed structure

### 4. Release Index Content Placement
**Issue**: Release index markdown content and ReleaseContents both in afterBody
**Impact**: Might need better separation or ordering
**Status**: Works but could be refined

### 5. Missing Type Labels in ReleaseContents
**Issue**: Not all types have custom labels
**Current**: Falls back to capitalized type name + "s"
**Resolution**: Add more type labels as needed

## Technical Insights

### Type System Architecture
The type-aware layouts system expects:
1. Type defined in `content/types/*.md` (Metadata Menu format)
2. Hardcoded fallback in `typeRegistry.ts`
3. Category determination (note/artifact/reference)
4. Layout definition in `typeLayouts.ts` (optional)
5. Emitter to process files (ContentPage, ArtifactPage, ReferencePage)

### Component Constructor Pattern
Quartz components use factory pattern:
```typescript
const Component: QuartzComponent = (props) => { /* JSX */ }
export default (() => Component) satisfies QuartzComponentConstructor
```

For components that use other components:
```typescript
import OtherComponentConstructor from "./Other"
const OtherComponent = OtherComponentConstructor()
// Then use OtherComponent in JSX
```

### Path Resolution
- Banner images support wiki-link format: `![[attachments/image.webp]]`
- Images resolved relative to current page slug
- External URLs (starting with `http`) used as-is

## Next Steps & TODO

### CRITICAL - Source Repository Reorganization
1. ✅ Document current state (this file)
2. ⬜ User reorganizes knowledge-base repo locally
3. ⬜ Sync knowledge-base changes to knowledge-garden
4. ⬜ Clean up remaining type folders if empty
5. ⬜ Update type folder index pages or remove them

### Future Enhancements
- [ ] Add release landing pages with featured content
- [ ] Implement manual ordering/curation options
- [ ] Add release metadata (dates, contributors, etc.)
- [ ] Create release-specific emitter if needed
- [ ] Add release navigation component
- [ ] Implement search/filter for releases
- [ ] Add release statistics/metrics

### Documentation Needs
- [ ] User guide for creating new releases
- [ ] Guidelines for when to create release vs standalone artifact
- [ ] Type system documentation update
- [ ] Component usage examples

## Files Modified/Created

### Modified Files
```
quartz/types/typeLoader.ts          - Fixed path to content/types/
quartz/types/typeRegistry.ts        - Added release type
quartz/types/typeLayouts.ts         - Added release layout (placeholder)
quartz/components/index.ts          - Exported new components
quartz/plugins/emitters/artifactPage.tsx - Added ReleaseContents
content/artifacts/index.md          - Release-focused navigation
```

### Created Files
```
content/types/release.md                    - Release type definition
quartz/components/ReleaseCard.tsx           - Artifact card component
quartz/components/ReleaseContents.tsx       - Release contents list
content/artifacts/reimagining-power/index.md
content/artifacts/dao-primitives/index.md
content/artifacts/governance-futures/index.md
content/artifacts/windfall-protocol/index.md
```

### Migrated Files (44 files)
See commit 1c1b63a for complete list of renamed/moved files.

## References

- **Branch**: https://github.com/superbenefit/knowledge-garden/tree/claude/store-published-works-01TRxEUhZfQqxuRjE1pGg8pR
- **Commit**: 1c1b63a
- **Quartz Docs**: https://quartz.jzhao.xyz/
- **Project CLAUDE.md**: See project instructions for type-aware system details
