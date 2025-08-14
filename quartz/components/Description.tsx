import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Description: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  // The Description plugin already handles frontmatter vs auto-generated logic
  const description = fileData.description
  
  if (!description) return null
  
  return (
    <p class="page-description">
      {description}
    </p>
  )
}

Description.css = `
.page-description {
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--gray);
  font-style: italic;
}

.dark .page-description {
  color: var(--lightgray);
}
`

export default (() => Description) satisfies QuartzComponentConstructor