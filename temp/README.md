# Release-Focused Artifacts - Temp Documentation

This folder contains documentation for the release-focused artifacts restructuring work.

## Quick Status

- **Branch**: `claude/store-published-works-01TRxEUhZfQqxuRjE1pGg8pR`
- **Commit**: `1c1b63a`
- **Status**: ⚠️ INCOMPLETE - Requires knowledge-base reorganization
- **Build**: ✅ Passing (215 files, 54 artifacts)

## Critical Issue

The knowledge-garden (Quartz site) has been reorganized with a release-focused structure, but the **source content in knowledge-base still uses the old type-based structure**. This creates:

- Mixed directory structure (release folders + type folders coexisting)
- Confusion about organization
- Potential sync issues

## What's Done

✅ Release type system integrated with type-aware layouts
✅ ReleaseCard and ReleaseContents components created
✅ Content migrated to release folders in knowledge-garden
✅ Release index pages created
✅ Build successful

## What's Needed

⬜ Reorganize knowledge-base repository to match
⬜ Clean up remaining type folders
⬜ Sync changes between repos
⬜ Test final structure

## Documentation Files

### 1. FEATURE-DOCUMENTATION.md
**Complete technical documentation** covering:
- Implementation details
- Design decisions
- Component architecture
- Type system integration
- Known issues and limitations
- Commit history
- Next steps

**Read this for**: Deep understanding of what was built and how it works

### 2. KNOWLEDGE-BASE-REORGANIZATION-PROMPT.md
**Actionable prompt for Claude Code** to execute in local environment with knowledge-base access.

Contains:
- Step-by-step reorganization tasks
- Exact file movements needed
- Frontmatter requirements
- Validation checklist
- Success criteria

**Use this**: Copy this entire prompt to Claude Code when reorganizing knowledge-base

## Quick Reference

### New Release Structure
```
artifacts/
├── reimagining-power/          ← RPP project
├── dao-primitives/             ← Framework + patterns + articles
├── governance-futures/         ← Article series
└── windfall-protocol/          ← Placeholder
```

### Old Type Structure (needs cleanup)
```
artifacts/
├── articles/    (1 file - index only)
├── guides/      (3 files - index + 2 standalone)
├── patterns/    (10 files - index + standalone patterns)
├── playbooks/   (1 file - index only)
└── studies/     (3 files - indices only)
```

### Key Files Modified
- `quartz/types/typeLoader.ts` - Fixed path
- `quartz/types/typeRegistry.ts` - Added release type
- `quartz/components/ReleaseCard.tsx` - NEW component
- `quartz/components/ReleaseContents.tsx` - NEW component
- `quartz/plugins/emitters/artifactPage.tsx` - Integrated ReleaseContents
- `content/artifacts/index.md` - Release showcase

## Next Actions

1. **User**: Execute KNOWLEDGE-BASE-REORGANIZATION-PROMPT.md in local Claude Code
2. **User**: Review and test reorganized structure
3. **User**: Sync knowledge-base changes to knowledge-garden
4. **Clean up**: Remove or update empty type folders
5. **Test**: Build and verify all releases display correctly

## Notes

- Standalone artifacts (discord-link-scraper, poetic-harvesting-guide, standalone patterns) intentionally left in type folders
- Windfall Protocol is placeholder with `publish: false`
- Build is currently working but directory structure is messy
- Release components automatically discover content in release directories

## Questions?

See FEATURE-DOCUMENTATION.md for detailed technical information.
