import { QuartzComponentConstructor, QuartzComponent } from "./types"
import { classNames } from "../util/lang"
import "./styles/citationGenerator.scss"
import citationStyles from './CitationStyles'
import { getExportFormat } from './CitationExports'
import { CitationFields } from './types/CitationTypes'

interface CitationGeneratorOptions {
  defaultStyle?: 'apa' | 'mla' | 'chicago' | 'ieee' | 'harvard'
}

function filterCitationData(data: any): CitationFields {
  // Only include required fields and non-empty optional fields
  const filtered: Partial<CitationFields> = {
    title: data.title || '',
    author: data.author || '',
    date: data.date || ''
  }

  // Optional fields - only include if they exist, aren't empty, and aren't null/undefined
  const optionalFields: (keyof CitationFields)[] = [
    'subtitle', 'type', 'journal', 'volume', 'issue', 'pages',
    'publisher', 'publisherLocation', 'edition', 'website',
    'doi', 'url', 'degree', 'language', 'abstract', 'keywords'
  ]

  optionalFields.forEach(field => {
    // Only add the field if it exists and has non-empty content
    if (data[field] && 
        typeof data[field] === 'string' && 
        data[field].trim() !== '') {
      if (field === 'type') {
        // Validate type field against allowed values
        const allowedTypes = ['article', 'book', 'chapter', 'conference', 'thesis', 'webpage'];
        if (allowedTypes.includes(data[field])) {
          (filtered as any)[field] = data[field];
        }
      } else {
        (filtered as any)[field] = data[field];
      }
    }
  })

  return filtered as CitationFields
}

export default ((opts?: CitationGeneratorOptions) => {
  const CitationGenerator: QuartzComponent = ({
    fileData,
    displayClass,
    cfg,
  }) => {
    if (!fileData.frontmatter?.quartzShowCitation) {
      return null
    }

    const locale = cfg?.locale ?? "en-US"
    const defaultStyle = opts?.defaultStyle ?? 'apa'
    const containerId = `citation-${Math.random().toString(36).substr(2, 9)}`

    const helperScript = `
      // Helper functions
      function sanitizeForExport(str) {
        return str?.replace(/[\\{\\}\\\\]/g, '\\$&') || '';
      }

      function formatAuthorAPA(author) {
        if (!author) return '';
        const parts = author.split(' ');
        const lastName = parts[parts.length - 1];
        const initials = parts.slice(0, -1).map(n => n[0].toUpperCase() + '.').join(' ');
        return \`\${lastName}, \${initials}\`;
      }

      function formatAuthors(author) {
        if (!author) return '';
        if (typeof author === 'string') {
          // Split the full name into parts
          const parts = author.split(' ');
          const lastName = parts[parts.length - 1];
          const firstName = parts.slice(0, -1).join(' ');
          return \`\${lastName}, \${firstName}\`;
        }
        return Array.isArray(author) ? author.map(a => {
          const parts = a.split(' ');
          const lastName = parts[parts.length - 1];
          const firstName = parts.slice(0, -1).join(' ');
          return \`\${lastName}, \${firstName}\`;
        }).join(' and ') : author;
      }

      function formatAuthorIEEE(author) {
        if (!author) return '';
        const parts = author.split(' ');
        const lastName = parts[parts.length - 1];
        const initials = parts.slice(0, -1).map(n => n[0].toUpperCase() + '.').join(' ');
        return \`\${initials} \${lastName}\`;
      }

      function formatDate(date) {
        return date ? new Date(date).getFullYear() : '';
      }

      function formatAuthorMLA(author) {
        if (!author) return '';
        const parts = author.split(' ');
        const lastName = parts[parts.length - 1];
        const firstName = parts.slice(0, -1).join(' ');
        return \`\${lastName}, \${firstName}\`;
      }

      // Citation styles
      window.citationHelpers = {
        styles: {
          apa: function(data) {
            const authors = formatAuthorAPA(data.author);
            const year = formatDate(data.date);
            const title = data.title || '';
            let citation = authors + ' (' + year + '). ' + title;
            
            if (data.journal) {
              citation += '. ' + data.journal;
              if (data.volume) citation += ', ' + data.volume;
              if (data.issue) citation += '(' + data.issue + ')';
              if (data.pages) citation += ', ' + data.pages;
            }
            if (data.doi) citation += '. https://doi.org/' + data.doi;
            
            return citation;
          },
          mla: function(data) {
            const author = formatAuthorMLA(data.author);
            const title = data.title || '';
            const year = new Date(data.date).getFullYear();
            let citation = author + '. "' + title + '"';
            
            if (data.journal) {
              citation += '. ' + data.journal;
              if (data.volume) citation += ', vol. ' + data.volume;
              if (data.issue) citation += ', no. ' + data.issue;
              citation += ', ' + year;
              if (data.pages) citation += ', pp. ' + data.pages;
            } else {
              citation += ', ' + year;
            }
            
            return citation + '.';
          },
          chicago: function(data) {
            const authors = formatAuthors(data.author);
            const title = data.title || '';
            const year = formatDate(data.date);
            let citation = \`\${authors}. "\${title}"\`;
            
            if (data.journal) {
              citation += \` \${data.journal}\`;
              if (data.volume) citation += \` \${data.volume}\`;
            }
            citation += \` (\${year})\`;
            if (data.pages) citation += \`: \${data.pages}\`;
            
            return citation + '.';
          },
          ieee: function(data) {
            const authors = formatAuthorIEEE(data.author);
            const title = data.title || '';
            const journal = data.journal;
            const year = new Date(data.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            
            let citation = \`\${authors}, "\${title}"\`;
            
            if (journal) {
              citation += \`, \${journal}\`;
            }
            
            if (data.volume) {
              citation += \`, vol. \${data.volume}\`;
            }
            if (data.issue) {
              citation += \`, no. \${data.issue}\`;
            }
            if (data.pages) {
              citation += \`, pp. \${data.pages}\`;
            }
            if (year) {
              citation += \`, \${year}\`;
            }
            
            return citation + '.';
          },
          harvard: function(data) {
            const authors = formatAuthorAPA(data.author);
            const year = formatDate(data.date);
            const title = data.title || '';
            
            let citation = \`\${authors}, \${year}. \${title}\`;
            
            if (data.journal) {
              citation += \`. \${data.journal}\`;
              if (data.volume) {
                citation += \`, \${data.volume}\`;
                if (data.issue) citation += \`(\${data.issue})\`;
              }
              if (data.pages) {
                citation += \`, pp.\${data.pages.replace(/\s+/g, '')}\`;
              }
            }
            
            return citation + '.';
          }
        },
        frontmatter: ${JSON.stringify(filterCitationData(fileData.frontmatter))},
        locale: "${locale}",
        exportFormat: function(format, fields) {
          const authors = formatAuthors(fields.author);
          const year = formatDate(fields.date);
          const title = fields.title || '';
          
          if (format === 'bibtex') {
            return \`@article{
  title={\${sanitizeForExport(title)}},
  author={\${sanitizeForExport(authors)}},
  year={\${year}},
  journal={\${sanitizeForExport(fields.journal || '')}},
  volume={\${fields.volume || ''}},
  number={\${fields.issue || ''}},
  pages={\${fields.pages || ''}},
  doi={\${fields.doi || ''}}
}\`;
          } else if (format === 'ris') {
            return \`TY  - JOUR
T1  - \${title}
AU  - \${authors}
PY  - \${year}
JF  - \${fields.journal || ''}
VL  - \${fields.volume || ''}
IS  - \${fields.issue || ''}
SP  - \${fields.pages || ''}
DO  - \${fields.doi || ''}
ER  -\`;
          }
          return '';
        }
      };
    `

    const initScript = `
      document.addEventListener('DOMContentLoaded', function() {
        try {
          const container = document.getElementById('${containerId}');
          if (!container) return;

          // Style selector
          const styleSelect = container.querySelector('select[data-citation-style]');
          styleSelect?.addEventListener('change', function(e) {
            const selectedStyle = e.target.value;
            const citationText = container.querySelector('[data-citation-text]');
            if (citationText && window.citationHelpers?.styles) {
              try {
                const styleFunction = window.citationHelpers.styles[selectedStyle];
                if (styleFunction) {
                  const newCitation = styleFunction(window.citationHelpers.frontmatter);
                  citationText.textContent = newCitation;
                }
              } catch (err) {
                // Silent error handling
              }
            }
          });

          // Copy button
          const copyButton = container.querySelector('button[data-citation-copy]');
          copyButton?.addEventListener('click', async function() {
            const citationText = container.querySelector('[data-citation-text]')?.textContent;
            if (citationText) {
              try {
                await navigator.clipboard.writeText(citationText);
              } catch (err) {
                // Silent error handling
              }
            }
          });

          // Export format selector
          const exportSelect = container.querySelector('select[data-citation-export]');
          exportSelect?.addEventListener('change', function(e) {
            const format = e.target.value;
            if (format === 'bibtex' || format === 'ris') {
              try {
                const exportText = window.citationHelpers.exportFormat(
                  format,
                  window.citationHelpers.frontmatter
                );
                navigator.clipboard.writeText(exportText);
                alert(format.toUpperCase() + ' format copied to clipboard!');
              } catch (err) {
                // Silent error handling
              }
              e.target.value = 'text';
            }
          });
        } catch (error) {
          // Silent error handling
        }
      });
    `

    return (
      <div className="citationWrapper" style={{
        margin: '1rem 0',
        padding: '0.75rem 1rem 1rem 1rem',
        border: '1px solid var(--gray)',
        backgroundColor: 'var(--lightgray)'
      }}>
        <div id={containerId} style={{
          width: '100%'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            marginBottom: '0.5rem'
          }}>
            <h3 style={{
              margin: 0,
              textAlign: 'center',
              fontWeight: '200',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              fontSize: '0.85rem',
              color: 'var(--dark)'
            }}>
              Citation
            </h3>
            <button 
              data-citation-copy 
              type="button"
              className="copy-button"
              style={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '0.65rem',
                fontWeight: '200',
                letterSpacing: '1px',
                color: 'var(--dark)',
                
              }}
            >Copy
            </button>
          </div>
          <div style={{
            position: 'relative',
            marginBottom: '-10px',
            zIndex: 1,
            display: 'flex',
            gap: 'clamp(2rem, 8vw, 5rem)',
            backgroundColor: 'transparent',
            padding: '0',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <select 
              data-citation-style 
              style={{
                maxHeight: '20px',

                lineHeight: '15px',
                letterSpacing: '1px',
                fontSize: '0.6rem',
                fontWeight: '200',
                textTransform: 'uppercase',
                width: '80px',
                padding: '0.1rem 0.5rem 0.2rem 0.5rem',
                border: '1px solid var(--gray)',
                borderRadius: '10px',
                backgroundColor: 'var(--light)',
                cursor: 'pointer',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none'
              }}
            >
              <option value="apa">APA</option>
              <option value="mla">MLA</option>
              <option value="chicago">Chicago</option>
              <option value="ieee">IEEE</option>
              <option value="harvard">Harvard</option>
            </select>
            
            <select 
              data-citation-export 
              style={{
                maxHeight: '20px',
                lineHeight: '15px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.6rem',
                fontWeight: '200',
                width: '80px',
                padding: '0.1rem 0.5rem 0.2rem 0.5rem',
                border: '1px solid var(--gray)',
                borderRadius: '10px',
                backgroundColor: 'var(--light)',
                cursor: 'pointer',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none'
              }}
            >
              <option value="text">Export</option>
              <option value="bibtex">BibTeX</option>
              <option value="ris">RIS</option>
            </select>
          </div>
          
          <div className="citationContent" style={{
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
            <div 
              data-citation-text 
              className="citationText" 
              style={{

                fontSize: '0.8rem',
                lineHeight: '1.4rem',
                fontWeight: '300',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                transition: 'all 0.2s ease'
              }}
            >
              {citationStyles[defaultStyle](filterCitationData(fileData.frontmatter))}
            </div>
          </div>
        </div>
        <script dangerouslySetInnerHTML={{ __html: helperScript }} />
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </div>
    )
  }

  return CitationGenerator
}) as QuartzComponentConstructor

// Helper functions for formatting
function formatAuthorAPA(author: string | string[]): string {
  if (Array.isArray(author)) {
    return author.join(", ")
  }
  return author
}

function formatAuthorMLA(author: string | string[]): string {
  if (Array.isArray(author)) {
    return author.join(", ")
  }
  return author
} 