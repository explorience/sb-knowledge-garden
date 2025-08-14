import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { getLayoutForType } from "../types/typeLayouts"

const TypeAwareAfterBody: QuartzComponent = (props: QuartzComponentProps) => {
  const type = props.fileData.frontmatter?.type as string | undefined
  const layout = getLayoutForType(type)
  
  // If no type-specific layout or no afterBody components, render nothing
  if (!layout || !layout.afterBody || layout.afterBody.length === 0) {
    return null
  }
  
  // Filter out any standard components we don't want (like Graph which goes last)
  const customAfterBodyComponents = layout.afterBody.filter(comp => 
    comp.displayName !== 'Graph'
  )
  
  if (customAfterBodyComponents.length === 0) {
    return null
  }
  
  return (
    <div class="type-aware-after-body">
      {customAfterBodyComponents.map((Component, index) => (
        <Component key={index} {...props} />
      ))}
    </div>
  )
}

TypeAwareAfterBody.displayName = "TypeAwareAfterBody"

TypeAwareAfterBody.css = `
.type-aware-after-body {
  margin: 0;
  padding: 0;
}
`

export default (() => TypeAwareAfterBody) satisfies QuartzComponentConstructor