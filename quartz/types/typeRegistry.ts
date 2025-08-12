/**
 * Type Registry for SuperBenefit Knowledge Garden
 * 
 * This module provides the core type system for Quartz, enabling different
 * page layouts based on content type. It's designed to mirror the Obsidian
 * Metadata Menu type system for consistency.
 * 
 * Key Features:
 * - Dynamic type loading from content/tools/types/ (hybrid approach)
 * - Hardcoded fallback definitions for reliability
 * - Inheritance-based type hierarchy
 * - Multiple detection methods (frontmatter, fileClass, directory)
 * - Category classification for high-level grouping
 * 
 * Usage:
 * - Called by TypeLayout transformer during Quartz build
 * - Detects type for each content file
 * - Returns type information for layout selection
 * 
 * Last Updated: 2025-08-12
 * Author: Claude (Anthropic)
 */

import { LoadedTypeDefinitions } from './typeLoader'

/**
 * TypeDefinition Interface
 * Represents a content type with its metadata and relationships
 */
export interface TypeDefinition {
  name: string                  // Type identifier (e.g., 'playbook', 'pattern')
  extends?: string              // Parent type for inheritance
  filesPaths: string[]          // Directory paths where this type is found
  icon: string                  // Icon identifier for UI display
  // Computed properties (added during initialization)
  children?: string[]           // Direct child types
  allFieldNames?: string[]      // All field names including inherited
  directoryPatterns?: RegExp[]  // Compiled regex patterns for path matching
}

/**
 * Hardcoded type definitions from knowledge-base/tools/types
 * Last updated: 2024-01-11
 */
export const TYPE_DEFINITIONS: Record<string, TypeDefinition> = {
  // Base type
  note: {
    name: 'note',
    extends: undefined,
    filesPaths: ['notes', 'drafts'],
    icon: 'notepad-text'
  },

  // Reference branch (extends note)
  reference: {
    name: 'reference',
    extends: 'note',
    filesPaths: [],
    icon: 'notepad-text'
  },

  index: {
    name: 'index',
    extends: 'reference',
    filesPaths: [],
    icon: 'folder-search'
  },

  link: {
    name: 'link',
    extends: 'reference',
    filesPaths: ['library'],
    icon: 'link'
  },

  tag: {
    name: 'tag',
    extends: 'reference',
    filesPaths: ['tags'],
    icon: 'tag'
  },

  // Artifact branch (extends note)
  artifact: {
    name: 'artifact',
    extends: 'note',
    filesPaths: ['artifacts'],
    icon: 'package'
  },

  article: {
    name: 'article',
    extends: 'artifact',
    filesPaths: ['artifacts/articles'],
    icon: 'file-text'
  },

  pattern: {
    name: 'pattern',
    extends: 'artifact',
    filesPaths: ['artifacts/patterns'],
    icon: 'layout-template'
  },

  playbook: {
    name: 'playbook',
    extends: 'artifact',
    filesPaths: ['artifacts/playbooks'],
    icon: 'book-open'
  },

  study: {
    name: 'study',
    extends: 'artifact',
    filesPaths: [],  // Studies can be in various locations
    icon: 'search'
  },

  // Additional types
  guide: {
    name: 'guide',
    extends: 'artifact',
    filesPaths: [],
    icon: 'map'
  },

  protocol: {
    name: 'protocol',
    extends: 'note',
    filesPaths: [],
    icon: 'settings'
  }
}

/**
 * Initialize computed properties for all type definitions
 * This function is called once at module load to set up:
 * - Directory patterns for fast path matching
 * - Parent-child relationships
 * - Inheritance chains
 */
function initializeTypeRegistry(): void {
  // Compile directory patterns for fast matching
  for (const typeDef of Object.values(TYPE_DEFINITIONS)) {
    typeDef.directoryPatterns = typeDef.filesPaths.map(path => 
      new RegExp(`^content/${path.replace(/\//g, '\\/')}/`)
    )
    typeDef.children = []
  }

  // Build parent-child relationships
  for (const [name, typeDef] of Object.entries(TYPE_DEFINITIONS)) {
    if (typeDef.extends && TYPE_DEFINITIONS[typeDef.extends]) {
      TYPE_DEFINITIONS[typeDef.extends].children!.push(name)
    }
  }
}

// Initialize on load
initializeTypeRegistry()

/**
 * Dynamic type definitions (loaded at build time)
 * Falls back to hardcoded definitions if loading fails
 */
let dynamicTypeDefinitions: Record<string, TypeDefinition> | null = null
let dynamicCategories: Record<string, string> | null = null
let dynamicInheritance: Record<string, string[]> | null = null

/**
 * Initialize registry with loaded type definitions
 * This is called by the build system to use dynamic types
 */
export function initializeWithLoadedTypes(loadedTypes: LoadedTypeDefinitions): void {
  console.log(`[TypeRegistry] Initializing with ${Object.keys(loadedTypes.types).length} loaded type definitions`)
  
  dynamicTypeDefinitions = loadedTypes.types
  dynamicCategories = loadedTypes.categories
  dynamicInheritance = loadedTypes.inheritance
  
  // Initialize computed properties for dynamic types
  for (const typeDef of Object.values(dynamicTypeDefinitions)) {
    typeDef.directoryPatterns = typeDef.filesPaths.map(path => 
      new RegExp(`^content/${path.replace(/\//g, '\\/')}/`)
    )
    typeDef.children = []
  }

  // Build parent-child relationships for dynamic types
  for (const [name, typeDef] of Object.entries(dynamicTypeDefinitions)) {
    if (typeDef.extends && dynamicTypeDefinitions[typeDef.extends]) {
      dynamicTypeDefinitions[typeDef.extends].children!.push(name)
    }
  }
  
  console.log(`[TypeRegistry] Dynamic type categories:`, dynamicCategories)
}

/**
 * Get active type definitions (dynamic if available, otherwise hardcoded)
 */
function getActiveTypeDefinitions(): Record<string, TypeDefinition> {
  return dynamicTypeDefinitions || TYPE_DEFINITIONS
}

/**
 * Check if dynamic types are loaded
 */
export function hasDynamicTypes(): boolean {
  return dynamicTypeDefinitions !== null
}

/**
 * Get the inheritance chain for a type (from root to type)
 */
export function getInheritanceChain(typeName: string): string[] {
  // Use dynamic inheritance if available
  if (dynamicInheritance && dynamicInheritance[typeName]) {
    return dynamicInheritance[typeName]
  }
  
  // Fall back to hardcoded logic
  const typeDefinitions = getActiveTypeDefinitions()
  const type = typeDefinitions[typeName]
  if (!type) return []
  
  if (!type.extends) {
    return [typeName]
  }
  
  return [...getInheritanceChain(type.extends), typeName]
}

/**
 * Get type category (reference, artifact, or note)
 */
export function getTypeCategory(typeName: string): 'reference' | 'artifact' | 'note' {
  // Use dynamic categories if available
  if (dynamicCategories && dynamicCategories[typeName]) {
    return dynamicCategories[typeName] as 'reference' | 'artifact' | 'note'
  }
  
  // Fall back to hardcoded logic
  const chain = getInheritanceChain(typeName)
  
  if (chain.includes('reference')) return 'reference'
  if (chain.includes('artifact')) return 'artifact'
  return 'note'
}

/**
 * Detect type from frontmatter and file path
 * 
 * Detection priority:
 * 1. Explicit 'type' property in frontmatter
 * 2. 'fileClass' property (Obsidian Metadata Menu)
 * 3. Directory-based detection using filesPaths
 * 
 * @param frontmatter - The parsed frontmatter object from the markdown file
 * @param slug - The file path/slug (e.g., 'content/artifacts/playbooks/example')
 * @returns The detected type name, or null if no type matches
 */
export function detectType(frontmatter: any, slug: string): string | null {
  const typeDefinitions = getActiveTypeDefinitions()
  
  // 1. Check explicit type declaration
  if (frontmatter?.type) {
    const type = Array.isArray(frontmatter.type) ? frontmatter.type[0] : frontmatter.type
    if (typeDefinitions[type]) {
      return type
    }
  }

  // 2. Check fileClass (Metadata Menu)
  if (frontmatter?.fileClass && typeDefinitions[frontmatter.fileClass]) {
    return frontmatter.fileClass
  }

  // 3. Fall back to directory-based detection
  // Sort types by path specificity (longest paths first) to avoid false matches
  const typesBySpecificity = Object.entries(typeDefinitions)
    .filter(([, typeDef]) => typeDef.filesPaths.length > 0)
    .sort(([, a], [, b]) => {
      const aMaxLength = Math.max(...a.filesPaths.map(p => p.length))
      const bMaxLength = Math.max(...b.filesPaths.map(p => p.length))
      return bMaxLength - aMaxLength // Descending order (most specific first)
    })

  for (const [typeName, typeDef] of typesBySpecificity) {
    if (typeDef.directoryPatterns?.some(pattern => pattern.test(slug))) {
      return typeName
    }
  }

  return null
}

/**
 * Check if a type extends another type
 */
export function isTypeDescendantOf(childType: string, parentType: string): boolean {
  const chain = getInheritanceChain(childType)
  return chain.includes(parentType)
}

/**
 * Get all types in a category
 */
export function getTypesInCategory(category: 'reference' | 'artifact' | 'note'): string[] {
  const typeDefinitions = getActiveTypeDefinitions()
  return Object.keys(typeDefinitions).filter(name => 
    getTypeCategory(name) === category
  )
}

// Export type hierarchy for debugging
export const TYPE_HIERARCHY = {
  note: {
    children: TYPE_DEFINITIONS.note.children || [],
    category: 'note'
  },
  reference: {
    children: TYPE_DEFINITIONS.reference?.children || [],
    category: 'reference'
  },
  artifact: {
    children: TYPE_DEFINITIONS.artifact?.children || [],
    category: 'artifact'
  }
}