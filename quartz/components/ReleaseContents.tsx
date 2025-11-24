import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { QuartzPluginData } from "../plugins/vfile"
import ReleaseCardConstructor from "./ReleaseCard"

// Initialize the ReleaseCard component
const ReleaseCard = ReleaseCardConstructor()

/**
 * ReleaseContents Component
 * Displays all artifacts within a release directory, organized by type
 * Includes a slot for the release index.md markdown content
 */
const ReleaseContents: QuartzComponent = ({ fileData, allFiles, cfg }: QuartzComponentProps) => {
  // Get the directory of the current release index page
  const releaseDir = fileData.slug?.split('/').slice(0, -1).join('/') || ''

  // Filter files that belong to this release
  // - Must be published
  // - Must be in the same directory or subdirectory
  // - Must not be the index page itself
  // - Must have a type
  const releaseFiles = allFiles.filter((file) => {
    const isPublished = file.frontmatter?.publish === true || file.frontmatter?.publish === 'true'
    const fileDir = file.slug?.split('/').slice(0, -1).join('/') || ''
    const isInReleaseDir = fileDir.startsWith(releaseDir + '/') || fileDir === releaseDir
    const isNotIndex = file.slug !== fileData.slug
    const hasType = file.frontmatter?.type && file.frontmatter?.type !== 'release'

    return isPublished && isInReleaseDir && isNotIndex && hasType
  })

  if (releaseFiles.length === 0) {
    return (
      <div class="release-contents">
        <p class="release-contents-empty">No published content in this release yet.</p>
      </div>
    )
  }

  // Group files by type
  const filesByType: Record<string, QuartzPluginData[]> = {}
  releaseFiles.forEach((file) => {
    const type = Array.isArray(file.frontmatter?.type)
      ? file.frontmatter?.type[0]
      : file.frontmatter?.type

    if (type) {
      if (!filesByType[type]) {
        filesByType[type] = []
      }
      filesByType[type].push(file)
    }
  })

  // Define type order for display (customize as needed)
  const typeOrder = ['article', 'playbook', 'guide', 'pattern', 'study', 'protocol']
  const sortedTypes = Object.keys(filesByType).sort((a, b) => {
    const aIndex = typeOrder.indexOf(a)
    const bIndex = typeOrder.indexOf(b)
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b)
    if (aIndex === -1) return 1
    if (bIndex === -1) return -1
    return aIndex - bIndex
  })

  // Type labels for section headings
  const typeLabels: Record<string, string> = {
    'article': 'Articles',
    'pattern': 'Patterns',
    'playbook': 'Playbooks',
    'study': 'Studies',
    'guide': 'Guides',
    'protocol': 'Protocols'
  }

  return (
    <div class="release-contents">
      {sortedTypes.map((type) => {
        const files = filesByType[type]
        const label = typeLabels[type] || type.charAt(0).toUpperCase() + type.slice(1) + 's'

        return (
          <section class="release-section">
            <h2 class="release-section-title">{label}</h2>
            <div class="release-grid">
              {files.map((file) => (
                <ReleaseCard page={file} fileData={fileData} cfg={cfg} allFiles={allFiles} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

ReleaseContents.css = `
.release-contents {
  margin: 2rem 0;
}

.release-contents-empty {
  padding: 2rem;
  text-align: center;
  color: var(--gray);
  font-style: italic;
}

.release-section {
  margin-bottom: 3rem;
}

.release-section:last-child {
  margin-bottom: 0;
}

.release-section-title {
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--lightgray);
  font-size: 1.5rem;
  color: var(--dark);
}

.release-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 800px) {
  .release-section {
    margin-bottom: 2rem;
  }

  .release-section-title {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }

  .release-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (min-width: 1400px) {
  .release-grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
}
`

export default (() => ReleaseContents) satisfies QuartzComponentConstructor
