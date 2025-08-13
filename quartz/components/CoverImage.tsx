import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"

const CoverImage: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const image = fileData.frontmatter?.image
  
  if (!image) return null
  
  // Handle both external URLs and internal paths
  const imageSrc = image.startsWith('http') 
    ? image 
    : resolveRelative(fileData.slug!, image)
  
  const title = fileData.frontmatter?.title || 'Cover image'
  
  return (
    <div class="cover-image">
      <img 
        src={imageSrc} 
        alt={title}
        loading="eager"
      />
    </div>
  )
}

CoverImage.css = `
.cover-image {
  width: 100%;
  margin: 1rem 0 0.5rem 0;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.cover-image img {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
  display: block;
}

@media (max-width: 800px) {
  .cover-image {
    margin: 0.5rem 0 0.25rem 0;
    border-radius: 0.25rem;
  }
  
  .cover-image img {
    max-height: 250px;
  }
}
`

export default (() => CoverImage) satisfies QuartzComponentConstructor