import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"

export interface ReleaseCardProps extends QuartzComponentProps {
  page: QuartzPluginData
}

/**
 * ReleaseCard Component
 * Displays an individual artifact as an attractive card with image, title, description, and metadata
 */
const ReleaseCard: QuartzComponent = ({ page, fileData, cfg }: ReleaseCardProps) => {
  const title = page.frontmatter?.title || 'Untitled'
  const description = page.frontmatter?.description
  const type = Array.isArray(page.frontmatter?.type)
    ? page.frontmatter?.type[0]
    : page.frontmatter?.type
  const tags = page.frontmatter?.tags || []

  // Extract banner image
  let bannerSrc: string | null = null
  const bannerRaw = page.frontmatter?.banner
  const imageRaw = page.frontmatter?.image

  if (bannerRaw) {
    const wikiLinkMatch = bannerRaw.match(/!?\[\[(.+?)\]\]/)
    if (wikiLinkMatch) {
      bannerSrc = resolveRelative(fileData.slug!, wikiLinkMatch[1])
    } else if (typeof bannerRaw === 'string' && bannerRaw.startsWith('http')) {
      bannerSrc = bannerRaw
    } else if (typeof bannerRaw === 'string') {
      bannerSrc = resolveRelative(fileData.slug!, bannerRaw.replace(/^\/+/, ''))
    }
  } else if (imageRaw) {
    if (typeof imageRaw === 'string' && imageRaw.startsWith('http')) {
      bannerSrc = imageRaw
    } else if (typeof imageRaw === 'string') {
      bannerSrc = resolveRelative(fileData.slug!, imageRaw.replace(/^\/+/, ''))
    }
  }

  const href = resolveRelative(fileData.slug!, page.slug!)

  // Type badge styling
  const typeEmoji: Record<string, string> = {
    'article': '📄',
    'pattern': '⚡',
    'playbook': '📖',
    'study': '🔬',
    'guide': '🗺️',
    'protocol': '⚙️'
  }

  return (
    <div class="release-card">
      <a href={href} class="release-card-link">
        {bannerSrc && (
          <div class="release-card-image">
            <img src={bannerSrc} alt={title} loading="lazy" />
          </div>
        )}
        <div class="release-card-content">
          <div class="release-card-header">
            <h3 class="release-card-title">{title}</h3>
            {type && (
              <span class="release-card-type">
                <span class="release-card-type-emoji">{typeEmoji[type] || '📌'}</span>
                <span class="release-card-type-label">{type}</span>
              </span>
            )}
          </div>
          {description && (
            <p class="release-card-description">{description}</p>
          )}
          {tags.length > 0 && (
            <div class="release-card-tags">
              {tags.slice(0, 5).map((tag: string) => (
                <span class="release-card-tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </a>
    </div>
  )
}

ReleaseCard.css = `
.release-card {
  background: var(--light);
  border: 1px solid var(--lightgray);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.release-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--secondary);
}

.release-card-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.release-card-image {
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: var(--lightgray);
}

.release-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.release-card:hover .release-card-image img {
  transform: scale(1.05);
}

.release-card-content {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.release-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.release-card-title {
  margin: 0;
  font-size: 1.1rem;
  line-height: 1.3;
  color: var(--dark);
  flex: 1;
}

.release-card-type {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: var(--highlight);
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

.release-card-type-emoji {
  font-size: 0.9rem;
}

.release-card-type-label {
  text-transform: capitalize;
}

.release-card-description {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--gray);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.release-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: auto;
}

.release-card-tag {
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  background: var(--lightgray);
  border-radius: 3px;
  color: var(--gray);
}

@media (max-width: 800px) {
  .release-card-image {
    height: 140px;
  }

  .release-card-content {
    padding: 1rem;
  }

  .release-card-title {
    font-size: 1rem;
  }
}
`

export default (() => ReleaseCard) satisfies QuartzComponentConstructor
