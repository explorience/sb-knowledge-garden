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

import { PageLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { getTypeCategory } from "./quartz/types/typeRegistry"

/**
 * Base layout for all notes
 * This matches Quartz's defaultContentPageLayout exactly - no type-aware components
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
 * Simplified layout for reference materials
 * - No tag list in header (references are organizational)
 * - Custom explorer showing only reference types
 * - Extended graph depth for relationship visualization
 */
export const referenceLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.TypeBadge(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
  ],
  left: [
    Component.MobileOnly(Component.Spacer()),
    Component.DesktopOnly(Component.Explorer({
      title: "References",
      filterFn: (node) => {
        // Show only reference types in explorer
        const type = node.file?.frontmatter?.type
        return type ? ['link', 'tag', 'index'].includes(type) : false
      }
    })),
  ],
  right: [
    Component.Graph({
      localGraph: {
        depth: 3,
        showTags: true,
      },
      globalGraph: {}
    }),
    Component.Backlinks(),
  ],
}

/**
 * Layout for artifact types (pattern, playbook, study, article)
 */
export const artifactLayout: PageLayout = {
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
      title: "Artifacts",
      filterFn: (node) => {
        const path = node.file?.slug || ''
        return path.startsWith('artifacts/')
      }
    })),
  ],
  right: [
    Component.Graph({
      localGraph: {
        depth: 2,
        showTags: true,
      },
      globalGraph: {}
    }),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

/**
 * Specific layout for pattern type
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
      title: "Patterns",
      filterFn: (node) => {
        const type = node.file?.frontmatter?.type
        const path = node.file?.slug || ''
        return type === 'pattern' || path.includes('patterns/')
      }
    })),
  ],
  right: [
    Component.Graph({
      localGraph: {
        depth: 2,
        showTags: false, // Focus on pattern relationships
      },
      globalGraph: {}
    }),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

/**
 * Specific layout for playbook type
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
      title: "Playbooks",
      filterFn: (node) => {
        const type = node.file?.frontmatter?.type
        const path = node.file?.slug || ''
        return type === 'playbook' || path.includes('playbooks/')
      }
    })),
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()), // TOC first for long guides
    Component.Graph({
      localGraph: {
        depth: 1,
        showTags: true,
      },
      globalGraph: {}
    }),
    Component.Backlinks(),
  ],
}

/**
 * Specific layout for study type
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
      title: "Case Studies",
      filterFn: (node) => {
        const type = node.file?.frontmatter?.type
        return type === 'study'
      }
    })),
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Graph({
      localGraph: {
        depth: 2,
        showTags: true,
      },
      globalGraph: {}
    }),
    Component.Backlinks(),
  ],
}

/**
 * Specific layout for link type
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
      title: "Library",
      filterFn: (node) => {
        const type = node.file?.frontmatter?.type
        const path = node.file?.slug || ''
        return type === 'link' || path.includes('library/')
      }
    })),
  ],
  right: [
    Component.Backlinks(), // Backlinks first for external resources
    Component.Graph({
      localGraph: {
        depth: 2,
        showTags: true,
      },
      globalGraph: {}
    }),
  ],
}

/**
 * Specific layout for tag type
 */
export const tagLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.TypeBadge(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
  ],
  left: [
    Component.MobileOnly(Component.Spacer()),
    Component.DesktopOnly(Component.Explorer({
      title: "Lexicon",
      filterFn: (node) => {
        const type = node.file?.frontmatter?.type
        const path = node.file?.slug || ''
        return type === 'tag' || path.includes('tags/')
      }
    })),
  ],
  right: [
    Component.Graph({
      localGraph: {
        depth: 3,
        showTags: true,
      },
      globalGraph: {
        showTags: true,
      }
    }),
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