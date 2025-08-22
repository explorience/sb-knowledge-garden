import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"

const BannerImage: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  // Check for both 'banner' (Obsidian) and 'image' (legacy) properties
  const bannerRaw = fileData.frontmatter?.banner
  const imageRaw = fileData.frontmatter?.image
  
  if (!bannerRaw && !imageRaw) return null
  
  let imagePath: string | null = null
  
  // Process banner property (Obsidian format)
  if (bannerRaw) {
    // Handle Obsidian wiki-link format: "![[attachments/image.webp]]"
    const wikiLinkMatch = bannerRaw.match(/!?\[\[(.+?)\]\]/)
    if (wikiLinkMatch) {
      imagePath = wikiLinkMatch[1]
    } else if (typeof bannerRaw === 'string') {
      // Handle plain string paths
      imagePath = bannerRaw
    }
  }
  
  // Fallback to legacy 'image' property if no banner
  if (!imagePath && imageRaw) {
    imagePath = imageRaw
  }
  
  if (!imagePath) return null
  
  // Handle external URLs (keep as-is)
  if (imagePath.startsWith('http')) {
    const title = fileData.frontmatter?.title || 'Banner image'
    return (
      <div class="banner-image">
        <img 
          src={imagePath} 
          alt={title}
          loading="eager"
        />
      </div>
    )
  }
  
  // For internal paths, resolve relative to the content directory
  // Remove any leading slashes
  imagePath = imagePath.replace(/^\/+/, '')
  
  // Resolve the path relative to the current page
  const imageSrc = resolveRelative(fileData.slug!, imagePath)
  const title = fileData.frontmatter?.title || 'Banner image'
  
  return (
    <div class="banner-image">
      <img 
        src={imageSrc} 
        alt={title}
        loading="eager"
      />
    </div>
  )
}

BannerImage.css = `
.banner-image {
  width: 100%;
  margin: 1rem 0 0.5rem 0;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.banner-image img {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
  display: block;
}

@media (max-width: 800px) {
  .banner-image {
    margin: 0.5rem 0 0.25rem 0;
    border-radius: 0.25rem;
  }
  
  .banner-image img {
    max-height: 250px;
  }
}
`

export default (() => BannerImage) satisfies QuartzComponentConstructor