import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { getLayoutForType } from "../types/typeLayouts"

const TypeAwareLeftContent: QuartzComponent = (props: QuartzComponentProps) => {
  const type = props.fileData.frontmatter?.type as string | undefined
  const layout = getLayoutForType(type)
  
  // If no type-specific layout or no left components, render nothing
  if (!layout || !layout.left || layout.left.length === 0) {
    return null
  }
  
  // Filter out MobileOnly components since this is wrapped in DesktopOnly
  const desktopComponents = layout.left.filter(comp => 
    comp.displayName !== 'MobileOnly'
  )
  
  if (desktopComponents.length === 0) {
    return null
  }
  
  return (
    <div class="type-aware-left-content">
      {desktopComponents.map((Component, index) => (
        <Component key={index} {...props} />
      ))}
    </div>
  )
}

TypeAwareLeftContent.displayName = "TypeAwareLeftContent"

TypeAwareLeftContent.css = `
.type-aware-left-content {
  margin: 0;
  padding: 0;
}
`

export default (() => TypeAwareLeftContent) satisfies QuartzComponentConstructor