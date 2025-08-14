import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { getLayoutForType } from "../types/typeLayouts"

const TypeAwareRightContent: QuartzComponent = (props: QuartzComponentProps) => {
  const type = props.fileData.frontmatter?.type as string | undefined
  const layout = getLayoutForType(type)
  
  // If no type-specific layout or no right components, render nothing
  if (!layout || !layout.right || layout.right.length === 0) {
    return null
  }
  
  // Filter out any mobile-only components and standard components we don't want
  const customRightComponents = layout.right.filter(comp => 
    comp.displayName !== 'MobileOnly' &&
    comp.displayName !== 'Graph' &&
    comp.displayName !== 'Backlinks' &&
    comp.displayName !== 'TableOfContents'
  )
  
  if (customRightComponents.length === 0) {
    return null
  }
  
  return (
    <div class="type-aware-right-content">
      {customRightComponents.map((Component, index) => (
        <Component key={index} {...props} />
      ))}
    </div>
  )
}

TypeAwareRightContent.displayName = "TypeAwareRightContent"

TypeAwareRightContent.css = `
.type-aware-right-content {
  margin: 0;
  padding: 0;
}
`

export default (() => TypeAwareRightContent) satisfies QuartzComponentConstructor