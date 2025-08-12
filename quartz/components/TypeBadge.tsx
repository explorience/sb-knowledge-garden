import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const TypeBadge: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const detectedType = fileData.detectedType
  const typeCategory = fileData.typeCategory
  
  if (!detectedType || !typeCategory) return null
  
  // Only show badges for artifact and reference types (not default notes)
  if (typeCategory === 'note' && detectedType === 'note') return null
  
  // Type-specific badge rendering
  const getBadgeContent = (type: string, category: string) => {
    switch (type) {
      case 'pattern':
        return '⚡ Pattern'
      case 'playbook':
        return '📖 Playbook'
      case 'study':
        return '🔍 Study'
      case 'article':
        return '📄 Article'
      case 'guide':
        return '🗺️ Guide'
      case 'protocol':
        return '⚙️ Protocol'
      case 'link':
        return '🔗 Link'
      case 'reference':
        return '📖 Reference'
      case 'tag':
        return '🏷️ Tag'
      case 'index':
        return '📂 Index'
      default:
        // Fallback based on category
        switch (category) {
          case 'artifact':
            return '📦 Artifact'
          case 'reference':
            return '📖 Reference'
          default:
            return null
        }
    }
  }
  
  const badgeText = getBadgeContent(detectedType, typeCategory)
  if (!badgeText) return null
  
  return (
    <div class={`type-badge type-badge-${detectedType} category-badge-${typeCategory}`}>
      <span class="badge-text">{badgeText}</span>
    </div>
  )
}

export default (() => TypeBadge) satisfies QuartzComponentConstructor