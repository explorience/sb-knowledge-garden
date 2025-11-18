# Action Plan for Completing Release Structure

## Phase 1: Review Current State ✅ COMPLETED

- [x] Document what was done in knowledge-garden
- [x] Identify issues with current structure
- [x] Create comprehensive documentation
- [x] Create reorganization prompt for knowledge-base

## Phase 2: Reorganize Source Repository ⬜ PENDING

**Execute in local environment with knowledge-base access**

### Step 1: Prepare
- [ ] Open knowledge-base repository in Claude Code (local)
- [ ] Create a new branch for reorganization
- [ ] Review current artifacts structure

### Step 2: Execute Reorganization
- [ ] Copy KNOWLEDGE-BASE-REORGANIZATION-PROMPT.md to Claude Code
- [ ] Let Claude Code execute the reorganization
- [ ] Review the changes
- [ ] Test that all files moved correctly
- [ ] Verify frontmatter is correct

### Step 3: Validate
- [ ] All release folders created
- [ ] Release index pages have `type: release`
- [ ] Content migrated to correct locations
- [ ] No broken internal links
- [ ] Standalone artifacts organized
- [ ] Type definition exists for "release"

### Step 4: Commit
- [ ] Commit reorganization to knowledge-base
- [ ] Push to remote
- [ ] Create PR if needed

## Phase 3: Sync to knowledge-garden ⬜ PENDING

### Step 1: Sync Changes
- [ ] Pull/sync knowledge-base changes to knowledge-garden
- [ ] Verify folder structure matches between repos

### Step 2: Clean Up knowledge-garden
- [ ] Remove or update empty type folders:
  - [ ] articles/ (only index.md remains)
  - [ ] playbooks/ (only index.md remains)
  - [ ] studies/ (only indices remain)
- [ ] Update type folder index pages or remove them
- [ ] Verify standalone artifacts in patterns/ and guides/

### Step 3: Test Build
- [ ] Run `npx quartz build`
- [ ] Check for errors
- [ ] Verify all releases detected
- [ ] Verify artifact count is correct

## Phase 4: Test & Verify ⬜ PENDING

### Step 1: Local Testing
- [ ] Run `npx quartz build --serve`
- [ ] Navigate to `/artifacts/`
- [ ] Verify release showcase displays correctly
- [ ] Test each release page:
  - [ ] `/artifacts/reimagining-power/`
  - [ ] `/artifacts/dao-primitives/`
  - [ ] `/artifacts/governance-futures/`
  - [ ] `/artifacts/windfall-protocol/`

### Step 2: Verify Release Display
For each release, check:
- [ ] Release index content displays (description, intro)
- [ ] ReleaseContents component renders
- [ ] Artifacts displayed as cards
- [ ] Cards show images, descriptions, type badges
- [ ] Grouped by type correctly
- [ ] Grid layout works on mobile and desktop

### Step 3: Verify Standalone Artifacts
- [ ] Patterns still accessible
- [ ] Guides still accessible
- [ ] Index pages updated or removed

### Step 4: Check Navigation
- [ ] Main artifacts index features releases
- [ ] Links to releases work
- [ ] Links to standalone artifacts work
- [ ] Breadcrumbs correct

## Phase 5: Finalize ⬜ PENDING

### Step 1: Documentation
- [ ] Update main README if needed
- [ ] Document new release creation process
- [ ] Add release guidelines

### Step 2: Commit Final Changes
- [ ] Stage all changes in knowledge-garden
- [ ] Review git diff
- [ ] Commit with descriptive message
- [ ] Push to branch

### Step 3: Create PR
- [ ] Create PR from branch to main
- [ ] Add description of changes
- [ ] Link to this documentation
- [ ] Request review

## Phase 6: Future Enhancements ⬜ OPTIONAL

- [ ] Add release metadata display (dates, contributors)
- [ ] Implement featured/pinned items in releases
- [ ] Add release search/filter
- [ ] Create release statistics
- [ ] Build release navigation component
- [ ] Add release landing pages
- [ ] Implement manual content ordering

## Troubleshooting Checklist

If build fails:
- [ ] Check type definition loaded correctly
- [ ] Verify release index pages have `type: release`
- [ ] Check for TypeScript errors in components
- [ ] Verify all imports correct
- [ ] Check for missing frontmatter

If releases don't display:
- [ ] Verify `publish: true` in frontmatter
- [ ] Check release directory paths match filesPaths in type definition
- [ ] Verify ReleaseContents condition works
- [ ] Check console for errors

If cards missing data:
- [ ] Verify artifacts have frontmatter (title, description, type)
- [ ] Check image paths resolve correctly
- [ ] Verify tags exist

## Current Blockers

1. **Source repository reorganization** - Cannot proceed with cleanup until knowledge-base is reorganized
2. **Mixed directory structure** - Creates confusion, needs resolution

## Notes

- Keep standalone artifacts in mind when cleaning up
- Don't delete type folders until confirming they're truly empty
- Test thoroughly before merging
- Consider user impact of URL changes (if any)

## Success Criteria

✅ knowledge-base reorganized with release structure
✅ knowledge-garden cleaned up and synced
✅ Build successful
✅ All releases display correctly
✅ No broken links
✅ Standalone artifacts accessible
✅ Documentation complete
✅ PR created and reviewed
