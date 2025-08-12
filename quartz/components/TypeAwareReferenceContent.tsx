import { htmlToJsx } from "../util/jsx"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

/**
 * TypeAware Reference Content Component
 * 
 * Renders content for reference category types (link, tag, index, reference)
 * with type-specific styling and behavior.
 */
const TypeAwareReferenceContent: QuartzComponent = ({ fileData, tree }: QuartzComponentProps) => {
  const content = htmlToJsx(fileData.filePath!, tree)
  const detectedType = fileData.detectedType || 'reference'
  const classes: string[] = fileData.frontmatter?.cssclasses ?? []
  
  // Add type-aware classes
  const typeAwareClasses = [
    "popover-hint",
    `type-${detectedType}`,
    "category-reference",
    ...classes
  ]
  
  // Add inheritance chain classes if available
  if (fileData.typeInheritanceChain && Array.isArray(fileData.typeInheritanceChain)) {
    fileData.typeInheritanceChain.forEach((ancestor: string) => {
      typeAwareClasses.push(`inherits-${ancestor}`)
    })
  }
  
  const classString = typeAwareClasses.join(" ")
  
  // Type-specific wrapper for reference content
  switch (detectedType) {
    case 'link':
      return (
        <article class={classString} data-reference-type="link">
          <div class="reference-header link-header">
            <span class="reference-type-badge">External Resource</span>
          </div>
          {content}
        </article>
      )
      
    case 'tag':
      return (
        <article class={classString} data-reference-type="tag">
          <div class="reference-header tag-header">
            <span class="reference-type-badge">Lexicon Entry</span>
          </div>
          {content}
        </article>
      )
      
    case 'index':
      return (
        <article class={classString} data-reference-type="index">
          <div class="reference-header index-header">
            <span class="reference-type-badge">Index Page</span>
          </div>
          {content}
        </article>
      )
      
    default:
      // Generic reference type
      return (
        <article class={classString} data-reference-type={detectedType}>
          <div class="reference-header">
            <span class="reference-type-badge">Reference</span>
          </div>
          {content}
        </article>
      )
  }
}

export default (() => TypeAwareReferenceContent) satisfies QuartzComponentConstructor