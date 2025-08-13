/**
 * Type-Based Layout Definitions for Quartz
 * 
 * This module defines custom page layouts for each content type in the knowledge garden.
 * Each layout specifies which components appear and where (beforeBody, left, right).
 * 
 * Layout Structure:
 * - beforeBody: Components above the main content (title, metadata, tags)
 * - left: Sidebar components (explorer, navigation)
 * - right: Sidebar components (graph, table of contents, backlinks)
 * 
 * Customization:
 * - Each type can have a unique combination of components
 * - Component order matters for visual hierarchy
 * - Explorer titles and filters are customized per type
 * 
 * Last Updated: 2025-08-11
 * Author: Claude (Anthropic)
 */

import { PageLayout } from "../cfg"
import * as Component from "../components"
import { getTypeCategory } from "./typeRegistry"

/**
 * Base layout for all notes
 * This matches Quartz's defaultContentPageLayout exactly
 * Files with 'note' type or no type should bypass our system entirely
 */
export const noteLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.MobileOnly(Component.Spacer()),
    Component.DesktopOnly(Component.Explorer({
      title: "Knowledge Garden",
    })),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

/**
 * Layout for reference types (link, tag, index)
 * Uses default Quartz layout with TypeBadge added
 */
export const referenceLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.TypeBadge(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.MobileOnly(Component.Spacer()),
    Component.DesktopOnly(Component.Explorer({
      title: "Knowledge Garden",
    })),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

/**
 * Layout for artifact types (pattern, playbook, study, article)
 * NOTE: This is now handled directly by the ArtifactPage emitter
 * This is kept for compatibility but not actively used
 */
export const artifactLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.TitleWithTypeBadge(),
    Component.ContentMeta(),
    Component.Description(),
    Component.TagList(),
  ],
  left: [
    Component.MobileOnly(Component.Spacer()),
    Component.DesktopOnly(Component.Explorer({
      title: "Knowledge Garden",
    })),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

/**
 * Specific layout for pattern type
 * Uses default Quartz layout with TypeBadge added
 */
export const patternLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.TypeBadge(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.MobileOnly(Component.Spacer()),
    Component.DesktopOnly(Component.Explorer({
      title: "Knowledge Garden",
    })),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

/**
 * Specific layout for playbook type
 * Uses default Quartz layout with TypeBadge added
 */
export const playbookLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.TypeBadge(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.MobileOnly(Component.Spacer()),
    Component.DesktopOnly(Component.Explorer({
      title: "Knowledge Garden",
    })),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

/**
 * Specific layout for study type
 * Uses default Quartz layout with TypeBadge added
 */
export const studyLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.TypeBadge(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.MobileOnly(Component.Spacer()),
    Component.DesktopOnly(Component.Explorer({
      title: "Knowledge Garden",
    })),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

/**
 * Specific layout for link type
 * Uses default Quartz layout with TypeBadge added
 */
export const linkLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.TypeBadge(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.MobileOnly(Component.Spacer()),
    Component.DesktopOnly(Component.Explorer({
      title: "Knowledge Garden",
    })),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

/**
 * Specific layout for tag type
 * Uses default Quartz layout with TypeBadge added
 */
export const tagLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.TypeBadge(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.MobileOnly(Component.Spacer()),
    Component.DesktopOnly(Component.Explorer({
      title: "Knowledge Garden",
    })),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

/**
 * Map of type names to their specific layouts
 */
export const TYPE_LAYOUTS: Record<string, PageLayout> = {
  // Base
  'note': noteLayout,
  
  // Reference types
  'reference': referenceLayout,
  'link': linkLayout,
  'tag': tagLayout,
  'index': referenceLayout,
  
  // Artifact types
  'artifact': artifactLayout,
  'pattern': patternLayout,
  'playbook': playbookLayout,
  'study': studyLayout,
  'article': artifactLayout,
  'guide': artifactLayout,
  
  // Other
  'protocol': noteLayout,
}

/**
 * Get the appropriate layout for a content type
 * 
 * Resolution order:
 * 1. Check for type-specific layout (e.g., 'playbook')
 * 2. Fall back to category layout (e.g., 'artifact')
 * 3. Fall back to base note layout
 * 
 * @param type - The content type identifier
 * @returns The appropriate PageLayout, or null if type is undefined
 */
export function getLayoutForType(type?: string): PageLayout | null {
  if (!type) return null
  
  // Check for specific type layout
  if (TYPE_LAYOUTS[type]) {
    return TYPE_LAYOUTS[type]
  }
  
  // Fall back to category layout
  const category = getTypeCategory(type)
  switch (category) {
    case 'artifact':
      return artifactLayout
    case 'reference':
      return referenceLayout
    default:
      return noteLayout
  }
}