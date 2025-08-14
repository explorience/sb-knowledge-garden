import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { getLayoutForType } from "../types/typeLayouts"

const TypeAwareBeforeBody: QuartzComponent = (props: QuartzComponentProps) => {
  const type = props.fileData.frontmatter?.type as string | undefined
  const layout = getLayoutForType(type)
  
  // If no type-specific layout or no beforeBody components, render nothing
  if (!layout || !layout.beforeBody || layout.beforeBody.length === 0) {
    return null
  }
  
  // Filter out any standard components we don't want (components already in unified layout)
  const customBeforeBodyComponents = layout.beforeBody.filter(comp => 
    comp.displayName !== 'Breadcrumbs' &&
    comp.displayName !== 'TitleWithTypeBadge' &&
    comp.displayName !== 'ArticleTitle' &&
    comp.displayName !== 'ContentMeta' &&
    comp.displayName !== 'TagList' &&
    comp.displayName !== 'Description' &&
    comp.displayName !== 'BannerImage'
  )
  
  if (customBeforeBodyComponents.length === 0) {
    return null
  }
  
  return (
    <div class="type-aware-before-body">
      {customBeforeBodyComponents.map((Component, index) => (
        <Component key={index} {...props} />
      ))}
    </div>
  )
}

TypeAwareBeforeBody.displayName = "TypeAwareBeforeBody"

TypeAwareBeforeBody.css = `
.type-aware-before-body {
  margin: 0;
  padding: 0;
}
`

export default (() => TypeAwareBeforeBody) satisfies QuartzComponentConstructor