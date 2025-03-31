import { QuartzComponentConstructor, QuartzComponent } from "./types"
import "./styles/licenseinfo.scss"

interface LicenseIconMap {
  [key: string]: {
    url: string
    icon: string
  }
}

const LICENSE_ICONS: LicenseIconMap = {
  CC: {
    url: "https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1",
    icon: "CC"
  },
  BY: {
    url: "https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1",
    icon: "BY"
  },
  SA: {
    url: "https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1",
    icon: "SA"
  },
  NC: {
    url: "https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1",
    icon: "NC"
  },
  ND: {
    url: "https://mirrors.creativecommons.org/presskit/icons/nd.svg?ref=chooser-v1",
    icon: "ND"
  },
  ZERO: {
    url: "https://mirrors.creativecommons.org/presskit/icons/zero.svg?ref=chooser-v1",
    icon: "ZERO"
  }
}

const LicenseInfo: QuartzComponent = ({ fileData, cfg }) => {
  const author = fileData.frontmatter?.author as string | string[] | undefined
  const authorUrl = fileData.frontmatter?.["authorURL"] as string | undefined
  const license = fileData.frontmatter?.license as string | undefined
  const title = fileData.frontmatter?.title as string | undefined
  const publishDate = fileData.frontmatter?.["date published"] as string | undefined
  const year = publishDate ? new Date(publishDate).getFullYear() : new Date().getFullYear()
  
  // Clean up the slug to prevent path duplication
  const cleanSlug = fileData.slug?.replace(/^\//, '') ?? ''  // Just remove leading slash
  const currentPageUrl = `/${cleanSlug}`

  if (!author || !license || !title) return null

  // Format multiple authors with commas and 'and'
  const formatAuthors = (authors: string | string[]): string => {
    if (typeof authors === 'string') return authors
    if (authors.length === 1) return authors[0]
    if (authors.length === 2) return `${authors[0]} and ${authors[1]}`
    return authors.slice(0, -1).join(', ') + ', and ' + authors[authors.length - 1]
  }

  const formattedAuthor = formatAuthors(author)

  const getLicenseUrl = (licenseStr: string) => {
    // Remove version number and clean up the license string
    const cleanLicense = licenseStr.replace(/\s+/g, '-').toLowerCase()
    return `https://creativecommons.org/licenses/${cleanLicense}/?ref=chooser-v1`
  }

  const getLicenseComponents = (licenseStr: string): string[] => {
    // Always include CC
    const components = ['CC']
    
    // Parse the license string
    const parts = licenseStr.toUpperCase().split(/[\s-]+/)
    
    parts.forEach(part => {
      if (part === 'BY' || part === 'SA' || part === 'NC' || part === 'ND' || part === 'ZERO') {
        components.push(part)
      }
    })

    return components
  }

  const components = getLicenseComponents(license)

  return (
    <div style={{
      margin: '1rem 0',
      padding: '0.75rem 1rem 1rem 1rem',
      border: '1px solid var(--gray)',
      backgroundColor: 'var(--lightgray)'
    }}>
      <div style={{
        width: '100%'
      }}>
        <h3 style={{
          margin: '0 0 0.5rem 0',
          textAlign: 'center',
          fontWeight: '200',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          fontSize: '0.85rem',
          color: 'var(--dark)'
        }}>
          Licensing
        </h3>
        <div style={{
          position: 'relative',
          marginBottom: '-10px',
          zIndex: 1,
          display: 'flex',
          gap: '1rem',
          backgroundColor: 'transparent',
          padding: '0',
          marginLeft: '20px'
        }}>
          <a 
            href={getLicenseUrl(license)} 
            target="_blank" 
            rel="license noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {components.map((component, index) => {
              const iconInfo = LICENSE_ICONS[component]
              if (!iconInfo) return null
              
              return (
                <img 
                  key={index}
                  src={iconInfo.url}
                  alt={iconInfo.icon}
                  title={iconInfo.icon}
                  style={{
                    height: '20px',
                    borderRadius: '15px',
                    verticalAlign: 'middle',
                    margin: '0 0 0 0'
                  }}
                />
              )
            })}
          </a>
        </div>
        <div style={{
          position: 'relative',
          boxSizing: 'border-box',
          padding: '1rem',
          backgroundColor: 'var(--light)',
          border: '1px solid var(--gray)',
          borderRadius: '6px',
          height: '125px',
          maxHeight: '125px',
          overflowY: 'scroll'
        }}>
          <p style={{
            margin: 0,
            fontSize: '0.8rem',
            lineHeight: '1.4rem',
            fontWeight: '300'
          }}>
            <a property="dct:title" rel="cc:attributionURL" href={currentPageUrl}>
              {title}
            </a> ({year}) by{" "}
            <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href={authorUrl}>
              {formattedAuthor}
            </a> is licensed under {license}
          </p>
        </div>
      </div>
    </div>
  )
}

export default (() => LicenseInfo) satisfies QuartzComponentConstructor