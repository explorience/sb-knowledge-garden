# Knowledge Base Reorganization Prompt for Claude Code

**Execute this prompt in Claude Code with access to the knowledge-base repository**

---

## Context

The knowledge-garden (Quartz site) repository has been reorganized to use a release-focused structure for artifacts instead of type-based organization. However, the knowledge-base (source content) repository still uses the old structure. Your task is to reorganize the knowledge-base repository to match the new release-focused structure implemented in knowledge-garden.

## Current State of knowledge-garden

The knowledge-garden `content/artifacts/` directory now has:

### Release Folders (NEW - What we want):
```
content/artifacts/
├── reimagining-power/
│   ├── index.md (type: release)
│   ├── article.md
│   ├── playbook.md
│   └── case-studies/
│       ├── equality-fund.md
│       ├── aifs.md
│       ├── ics.md
│       └── rpp-governance.md
├── dao-primitives/
│   ├── index.md (type: release)
│   ├── framework/
│   │   ├── index.md
│   │   ├── group-phase/
│   │   ├── group-scale/
│   │   ├── group-primitives/
│   │   ├── dao-primitives-implemention/
│   │   ├── group-facilitation.md
│   │   └── group-state.md
│   ├── patterns/
│   │   ├── cell.md
│   │   ├── cell-state.md
│   │   ├── cell-state-template.md
│   │   └── decider-protocol.md
│   └── network-evolution/
│       ├── index.md
│       ├── Building DAOs as scalable networks.md
│       ├── DAOs - From fractal primitives to network scale..md
│       ├── DAOs aren't things... they are flows..md
│       ├── Minimum Viable Permissionless-ness.md
│       └── Scale and the levers that provide DAOs their power.md
├── governance-futures/
│   ├── index.md (type: release)
│   └── articles/
│       ├── index.md
│       ├── Exploring governance for better futures.md
│       ├── Governance for better futures - DAO 2 DAO Co-operation.md
│       ├── Governance for better futures - Meta-governance.md
│       └── Governance for better futures - New and Old.md
└── windfall-protocol/
    └── index.md (type: release, publish: false)
```

### Old Type Folders (LEFTOVER - Need to handle):
```
content/artifacts/
├── articles/
│   └── index.md (only this file remains)
├── guides/
│   ├── index.md
│   ├── discord-link-scraper.md
│   └── poetic-harvesting-guide.md
├── patterns/
│   ├── index.md
│   ├── fiscal-bridge-pattern.md
│   ├── gatherings.md
│   ├── knowledge-gardens.md
│   ├── poetic-harvesting.md
│   └── progressive-web3-adoption.md
├── playbooks/
│   └── index.md (only this file remains)
└── studies/
    ├── index.md
    ├── experiments/
    │   └── index.md (only index remains)
    └── projects/
        └── index.md (only index remains)
```

## Your Tasks

### Task 1: Analyze Current knowledge-base Structure

First, examine the current `artifacts/` folder structure in the knowledge-base repository. Document:
1. Current folder organization
2. All files and their locations
3. Which files have `publish: true` in frontmatter
4. Which files need to be moved to match knowledge-garden structure

### Task 2: Create Release Folders

Create the following release directory structure in knowledge-base `artifacts/`:

```
artifacts/
├── reimagining-power/
│   ├── case-studies/
├── dao-primitives/
│   ├── framework/
│   │   ├── group-phase/
│   │   ├── group-scale/
│   │   ├── group-primitives/
│   │   └── dao-primitives-implemention/
│   ├── patterns/
│   └── network-evolution/
├── governance-futures/
│   └── articles/
└── windfall-protocol/
```

### Task 3: Migrate Content to Releases

#### Reimagining Power Project

Move the following content to `artifacts/reimagining-power/`:

**Main content**:
- Find the RPP article (about web3 transforming impact) → `article.md`
- Find the RPP playbook → `playbook.md`

**Case studies** to `artifacts/reimagining-power/case-studies/`:
- Equality Fund experiment case study
- AIFS (All In For Sport) experiment case study
- ICS (Institute for Community Sustainability) experiment case study
- RPP governance case study

#### DAO Primitives Framework

Move to `artifacts/dao-primitives/`:

**Framework content** to `artifacts/dao-primitives/framework/`:
- All DAO Primitives framework guides and documentation
- Group phase content (conversation, formation, organization, coordination, completion)
- Group scale content (collaboration, coordination, constituency, network)
- Group primitives (cells, roles, tasks, DAOs)
- Implementation guides (community governance, operational governance, multi-stakeholder)
- Group facilitation guide
- Group state documentation

**Patterns** to `artifacts/dao-primitives/patterns/`:
- Cell pattern
- Cell state pattern
- Cell state template
- Decider protocol
- Any other DAO Primitives-specific patterns

**Network Evolution Articles** to `artifacts/dao-primitives/network-evolution/`:
- "DAOs aren't things... they are flows"
- "Scale and the levers that provide DAOs their power"
- "DAOs - From fractal primitives to network scale"
- "Minimum Viable Permissionless-ness"
- "Building DAOs as scalable networks"

#### Governance for Better Futures

Move to `artifacts/governance-futures/articles/`:
- "Exploring governance for better futures"
- "Governance for better futures - Meta-governance"
- "Governance for better futures - DAO 2 DAO Co-operation"
- "Governance for better futures - New and Old"

### Task 4: Create Release Index Pages

Create an `index.md` file for each release with `type: release` in frontmatter:

#### `artifacts/reimagining-power/index.md`

```yaml
---
title: Reimagining Power Project
type: release
description: Exploring how web3 technologies can redistribute power, mobilize capital, and transform systems toward more equitable outcomes in philanthropy and social impact.
publish: true
releaseDate: 2024-03-15
tags:
  - impact
  - web3
  - philanthropy
  - power
  - governance
---

# Reimagining Power Project

[Add compelling description of the project, its goals, key achievements, and the artifacts it produced]

The Reimagining Power Project represents an 18-month journey exploring how web3 technologies might redistribute rather than replicate existing power structures in philanthropy and social impact.

## Project Artifacts

The artifacts below showcase the complete body of work from this project.
```

#### `artifacts/dao-primitives/index.md`

```yaml
---
title: DAO Primitives Framework
type: release
description: A comprehensive framework for designing decentralized organizations as purpose-aligned networks of small autonomous teams.
publish: true
releaseDate: 2024-06-01
tags:
  - dao
  - primitives
  - governance
  - decentralization
  - coordination
---

# DAO Primitives Framework

[Add description of the framework, its purpose, key concepts, and applications]

The DAO Primitives Framework provides a systematic approach to designing and implementing decentralized organizations as purpose-aligned networks.

## Framework Resources

Explore the complete collection of framework documentation, implementation guides, patterns, and articles below.
```

#### `artifacts/governance-futures/index.md`

```yaml
---
title: Governance for Better Futures
type: release
description: An exploration of how governance is evolving and what models we need to accelerate the arrival of better futures.
publish: true
releaseDate: 2023-09-15
tags:
  - governance
  - web3
  - meta-governance
  - dao
  - collaboration
---

# Governance for Better Futures

A conversation series exploring how the nature of governance is evolving, and inquiring into the governance we need to accelerate the arrival of better futures.

## Series Articles

Explore the full collection of articles from this conversation series below.
```

#### `artifacts/windfall-protocol/index.md`

```yaml
---
title: Windfall Protocol
type: release
description: Documentation and resources for the Windfall Protocol.
publish: false
releaseDate: 2024-12-01
tags:
  - windfall
  - protocol
  - web3
---

# Windfall Protocol

[Content coming soon - placeholder for future Windfall Protocol documentation]
```

### Task 5: Handle Standalone Artifacts

For artifacts that don't belong to a specific release, decide on one of these approaches:

**Option A: Keep in type folders** (simplest)
- Leave patterns like fiscal-bridge, gatherings, knowledge-gardens in `artifacts/patterns/`
- Leave guides like discord-link-scraper in `artifacts/guides/`
- Update their index pages to reflect "standalone artifacts"

**Option B: Create a "Tools & Patterns" release**
- Create `artifacts/tools-and-patterns/` release
- Move standalone items there
- Provides a home for miscellaneous high-value content

**Option C: Distribute to existing releases**
- Evaluate if any standalone artifacts actually belong in existing releases
- Move them if there's a thematic fit

**Recommendation**: Start with Option A. The knowledge-garden already expects some standalone artifacts to remain in type folders per the original plan.

### Task 6: Clean Up Old Structure

After migration:

1. **If type folders are now empty** (except index.md):
   - Consider removing the empty type folders
   - OR update index.md to say "This content has been reorganized into releases"
   - OR keep minimal type folders for future standalone content

2. **Update main artifacts index** (`artifacts/index.md`):
   - Ensure it features releases prominently
   - Adjust description to match new organization
   - Update links to point to releases

### Task 7: Update Type Definition

Ensure `tools/types/release.md` exists in knowledge-base with proper definition:

```yaml
---
limit: 50
mapWithTag: false
icon: package-open
tagNames:
filesPaths:
  - artifacts/reimagining-power
  - artifacts/dao-primitives
  - artifacts/governance-futures
  - artifacts/windfall-protocol
extends: artifact
fields:
  - name: releaseDate
    type: Date
  - name: relatedReleases
    type: MultiFile
    options:
      dvQueryString: |-
        dv.pages().where(p => {
          if (!p.publish || (p.publish != true && p.publish != "true")) return false;
          if (!p.type) return false;
          return p.type === "release" || (Array.isArray(p.type) && p.type.includes("release"));
        })
---

The Release type represents a curated collection of related artifacts organized around a specific project, initiative, or thematic series. Releases transform individual artifacts into coherent knowledge packages that tell a complete story about a body of work.
```

## Validation Steps

After completing the reorganization:

1. ✅ All release folders exist with correct structure
2. ✅ All migrated content has correct frontmatter (especially `publish` and `type`)
3. ✅ Release index pages have `type: release` in frontmatter
4. ✅ File paths match what knowledge-garden expects
5. ✅ No broken internal links (update wikilinks if paths changed)
6. ✅ Standalone artifacts have clear organization
7. ✅ Type definition for "release" exists in tools/types/

## Important Notes

### Frontmatter Requirements

Each release index.md must have:
- `type: release`
- `publish: true` (or `false` for windfall)
- `title:` and `description:`
- `releaseDate:` (optional but recommended)

### Internal Links

Watch for wikilinks that may break when moving files:
- `[[link]]` format should still work if files stay in same relative location
- May need to update paths if directory structure changes significantly

### File Naming

- Keep original filenames when moving (especially those with spaces)
- Maintain capitalization
- Don't rename unless specifically needed

### Metadata Preservation

Preserve all frontmatter when moving files:
- `publish: true/false`
- `type:` declarations
- `tags:` arrays
- `description:` text
- Any custom fields

## Expected Outcome

After execution, knowledge-base `artifacts/` should mirror knowledge-garden structure:

```
artifacts/
├── index.md (release showcase)
├── reimagining-power/
│   ├── index.md (type: release)
│   └── [migrated content]
├── dao-primitives/
│   ├── index.md (type: release)
│   └── [migrated content]
├── governance-futures/
│   ├── index.md (type: release)
│   └── [migrated content]
├── windfall-protocol/
│   └── index.md (type: release, publish: false)
└── [optional: standalone artifact folders]
    ├── patterns/ (if keeping standalone patterns)
    └── guides/ (if keeping standalone guides)
```

## Questions to Answer

As you work through this:

1. Are there any artifacts in knowledge-base that aren't in knowledge-garden?
2. Should any standalone artifacts actually belong to a release?
3. Are there any broken links after migration?
4. Do all release index pages have appropriate descriptions?
5. Is the main artifacts/index.md updated to feature releases?

## Success Criteria

✅ All content migrated to release-focused structure
✅ Release index pages created with correct frontmatter
✅ No broken internal links
✅ knowledge-base structure matches knowledge-garden
✅ Standalone artifacts have clear organization
✅ Build succeeds after sync
✅ All releases display correctly with their content

---

## Additional Context

This reorganization supports the knowledge-garden branch `claude/store-published-works-01TRxEUhZfQqxuRjE1pGg8pR` which has already implemented:
- Release type system
- ReleaseCard and ReleaseContents components
- Type-aware layouts integration
- Automatic content discovery for releases

See `temp/FEATURE-DOCUMENTATION.md` in knowledge-garden for complete technical details.
