import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import "./styles/typeBadge.scss"

// Lucide icon SVGs (16x16 size for badge use)
const lucideIcons: Record<string, string> = {
  'layout-template': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="9" x2="9" y2="21"/></svg>',
  'notebook-tabs': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><rect x="8" y="2" width="13" height="20" rx="2"/><path d="M15 2v20"/></svg>',
  'search': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
  'notepad-text': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M12 2v4"/><path d="M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M8 10h6"/><path d="M8 14h8"/><path d="M8 18h5"/></svg>',
  'book': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  'package': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
  'link': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  'tag': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
  'folder-search': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/><circle cx="11.5" cy="12.5" r="2.5"/><path d="M13.27 14.27 15 16"/></svg>',
  'settings': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>'
}

// Map type names to their icon names (from type definitions)
const typeIconMap: Record<string, string> = {
  'pattern': 'layout-template',
  'playbook': 'notebook-tabs',
  'study': 'search',
  'article': 'notepad-text',
  'guide': 'book',
  'protocol': 'settings',
  'link': 'link',
  'reference': 'notepad-text',
  'tag': 'tag',
  'index': 'folder-search',
  'artifact': 'package',
  'note': 'notepad-text'
}

const TypeBadge: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const detectedType = fileData.detectedType
  const typeCategory = fileData.typeCategory
  
  if (!detectedType || !typeCategory) return null
  
  // Only show badges for artifact and reference types (not default notes)
  if (typeCategory === 'note' && detectedType === 'note') return null
  
  // Get the icon name and display text
  const iconName = typeIconMap[detectedType] || typeIconMap[typeCategory] || 'notepad-text'
  const iconSvg = lucideIcons[iconName] || lucideIcons['notepad-text']
  const displayText = detectedType.charAt(0).toUpperCase() + detectedType.slice(1)
  
  return (
    <div class={`type-badge type-badge-${detectedType} category-badge-${typeCategory}`}>
      <span class="badge-icon" dangerouslySetInnerHTML={{ __html: iconSvg }} />
      <span class="badge-text">{displayText}</span>
    </div>
  )
}

TypeBadge.css = `
.type-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;
}

.type-badge .badge-icon {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

.type-badge .badge-icon svg {
  width: 16px;
  height: 16px;
}

.type-badge .badge-text {
  display: inline-flex;
  align-items: center;
}

.type-badge.category-badge-artifact,
.type-badge.category-badge-reference {
  background-color: var(--lightgray);
  color: var(--darkgray);
  border: 1px solid var(--gray);
}

.dark .type-badge.category-badge-artifact,
.dark .type-badge.category-badge-reference {
  background-color: var(--darkgray);
  color: var(--light);
  border-color: var(--gray);
}
`

export default (() => TypeBadge) satisfies QuartzComponentConstructor