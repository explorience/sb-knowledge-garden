import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import * as Component from "./index"

const TitleWithTypeBadge: QuartzComponent = (props: QuartzComponentProps) => {
  const ArticleTitle = Component.ArticleTitle()
  const TypeBadge = Component.TypeBadge()
  
  return (
    <div class="title-with-badge">
      <ArticleTitle {...props} />
      <TypeBadge {...props} />
    </div>
  )
}

TitleWithTypeBadge.css = `
.title-with-badge {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.title-with-badge .article-title {
  margin: 2rem 0 0 0;
}

.title-with-badge .type-badge {
  margin-top: 2.25rem;
  transform: translateY(-0.25rem);
}
`

export default (() => TitleWithTypeBadge) satisfies QuartzComponentConstructor