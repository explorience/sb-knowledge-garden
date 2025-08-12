import { htmlToJsx } from "../util/jsx"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

/**
 * TypeAware Artifact Content Component
 * 
 * Renders content for artifact category types (pattern, playbook, study, article, guide, protocol)
 * with type-specific styling and behavior.
 */
const TypeAwareArtifactContent: QuartzComponent = ({ fileData, tree }: QuartzComponentProps) => {
  const content = htmlToJsx(fileData.filePath!, tree)
  const detectedType = fileData.detectedType || 'artifact'
  const classes: string[] = fileData.frontmatter?.cssclasses ?? []
  
  // Add type-aware classes
  const typeAwareClasses = [
    "popover-hint",
    `type-${detectedType}`,
    "category-artifact",
    ...classes
  ]
  
  // Add inheritance chain classes if available
  if (fileData.typeInheritanceChain && Array.isArray(fileData.typeInheritanceChain)) {
    fileData.typeInheritanceChain.forEach((ancestor: string) => {
      typeAwareClasses.push(`inherits-${ancestor}`)
    })
  }
  
  const classString = typeAwareClasses.join(" ")
  
  // Type-specific wrapper for artifact content
  switch (detectedType) {
    case 'pattern':
      return (
        <article class={classString} data-artifact-type="pattern">
          <div class="artifact-header pattern-header">
            <span class="artifact-type-badge pattern-badge">⚡ Pattern</span>
            <span class="artifact-description">Reusable organizational solution</span>
          </div>
          {content}
        </article>
      )
      
    case 'playbook':
      return (
        <article class={classString} data-artifact-type="playbook">
          <div class="artifact-header playbook-header">
            <span class="artifact-type-badge playbook-badge">📖 Playbook</span>
            <span class="artifact-description">Step-by-step implementation guide</span>
          </div>
          {content}
        </article>
      )
      
    case 'study':
      return (
        <article class={classString} data-artifact-type="study">
          <div class="artifact-header study-header">
            <span class="artifact-type-badge study-badge">🔍 Case Study</span>
            <span class="artifact-description">Real-world analysis and insights</span>
          </div>
          {content}
        </article>
      )
      
    case 'article':
      return (
        <article class={classString} data-artifact-type="article">
          <div class="artifact-header article-header">
            <span class="artifact-type-badge article-badge">📄 Article</span>
            <span class="artifact-description">In-depth exploration</span>
          </div>
          {content}
        </article>
      )
      
    case 'guide':
      return (
        <article class={classString} data-artifact-type="guide">
          <div class="artifact-header guide-header">
            <span class="artifact-type-badge guide-badge">🗺️ Guide</span>
            <span class="artifact-description">Comprehensive reference</span>
          </div>
          {content}
        </article>
      )
      
    case 'protocol':
      return (
        <article class={classString} data-artifact-type="protocol">
          <div class="artifact-header protocol-header">
            <span class="artifact-type-badge protocol-badge">⚙️ Protocol</span>
            <span class="artifact-description">Systematic procedure</span>
          </div>
          {content}
        </article>
      )
      
    default:
      // Generic artifact type
      return (
        <article class={classString} data-artifact-type={detectedType}>
          <div class="artifact-header">
            <span class="artifact-type-badge">📦 Artifact</span>
            <span class="artifact-description">Validated knowledge</span>
          </div>
          {content}
        </article>
      )
  }
}

export default (() => TypeAwareArtifactContent) satisfies QuartzComponentConstructor