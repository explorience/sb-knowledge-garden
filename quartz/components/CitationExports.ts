import { CitationFields } from './types'
import citationStyles from './CitationStyles'

export const exportFormats = {
  bibtex: (fields: CitationFields): string => {
    // Determine entry type
    let entryType = 'misc' // default
    switch (fields.type) {
      case 'article':
        entryType = 'article'
        break
      case 'book':
        entryType = 'book'
        break
      case 'chapter':
        entryType = 'inbook'
        break
      case 'conference':
        entryType = 'inproceedings'
        break
      case 'thesis':
        entryType = fields.degree?.toLowerCase().includes('phd') ? 'phdthesis' : 'mastersthesis'
        break
    }

    // Generate citation key (authorYearFirstWord)
    const firstAuthor = Array.isArray(fields.author) ? fields.author[0] : fields.author
    const year = new Date(fields.date).getFullYear()
    const firstWord = fields.title.split(' ')[0].toLowerCase()
    const citationKey = `${firstAuthor.split(' ').pop()}${year}${firstWord}`

    // Build BibTeX entry
    let entry = `@${entryType}{${citationKey},\n`

    // Required fields
    if (Array.isArray(fields.author)) {
      entry += `  author = {${fields.author.join(' and ')}},\n`
    } else {
      entry += `  author = {${fields.author}},\n`
    }
    entry += `  title = {${fields.title}},\n`
    entry += `  year = {${year}},\n`

    // Optional fields based on type
    if (fields.journal) entry += `  journal = {${fields.journal}},\n`
    if (fields.volume) entry += `  volume = {${fields.volume}},\n`
    if (fields.issue) entry += `  number = {${fields.issue}},\n`
    if (fields.pages) entry += `  pages = {${fields.pages}},\n`
    if (fields.publisher) entry += `  publisher = {${fields.publisher}},\n`
    if (fields.doi) entry += `  doi = {${fields.doi}},\n`
    if (fields.url) entry += `  url = {${fields.url}},\n`
    if (fields.publisherLocation) entry += `  address = {${fields.publisherLocation}},\n`
    if (fields.edition) entry += `  edition = {${fields.edition}},\n`
    if (fields.institution) entry += `  institution = {${fields.institution}},\n`

    // Remove trailing comma and close entry
    entry = entry.replace(/,\n$/, '\n')
    entry += '}'

    return entry
  },

  ris: (fields: CitationFields): string => {
    let entry = ''

    // Determine type
    let risType = 'MISC' // default
    switch (fields.type) {
      case 'article':
        risType = 'JOUR'
        break
      case 'book':
        risType = 'BOOK'
        break
      case 'chapter':
        risType = 'CHAP'
        break
      case 'conference':
        risType = 'CONF'
        break
      case 'thesis':
        risType = 'THES'
        break
      case 'webpage':
        risType = 'ELEC'
        break
    }

    // Start entry
    entry += `TY  - ${risType}\n`

    // Authors
    if (Array.isArray(fields.author)) {
      fields.author.forEach(author => {
        entry += `AU  - ${author}\n`
      })
    } else {
      entry += `AU  - ${fields.author}\n`
    }

    // Title
    entry += `TI  - ${fields.title}\n`
    if (fields.subtitle) {
      entry += `ST  - ${fields.subtitle}\n`
    }

    // Publication year
    const date = new Date(fields.date)
    entry += `PY  - ${date.getFullYear()}\n`
    entry += `DA  - ${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}\n`

    // Optional fields
    if (fields.journal) entry += `JO  - ${fields.journal}\n`
    if (fields.volume) entry += `VL  - ${fields.volume}\n`
    if (fields.issue) entry += `IS  - ${fields.issue}\n`
    if (fields.pages) entry += `SP  - ${fields.pages}\n`
    if (fields.publisher) entry += `PB  - ${fields.publisher}\n`
    if (fields.doi) entry += `DO  - ${fields.doi}\n`
    if (fields.url) entry += `UR  - ${fields.url}\n`
    if (fields.publisherLocation) entry += `CY  - ${fields.publisherLocation}\n`
    if (fields.language) entry += `LA  - ${fields.language}\n`
    if (fields.abstract) entry += `AB  - ${fields.abstract}\n`
    if (fields.keywords) entry += `KW  - ${fields.keywords.join('\nKW  - ')}\n`

    // End entry
    entry += 'ER  - \n'

    return entry
  }
}

// Helper function to sanitize fields for export
function sanitizeForExport(text: string): string {
  return text
    .replace(/[{|}]/g, '') // Remove BibTeX special characters
    .replace(/[\\]/g, '')  // Remove escape characters
    .trim()
}

// Usage in component
export function getExportFormat(format: 'bibtex' | 'ris' | 'apa' | 'mla' | 'chicago' | 'ieee' | 'harvard', fields: CitationFields): string {
  const sanitizedFields = Object.entries(fields).reduce((acc, [key, value]) => {
    acc[key] = typeof value === 'string' ? sanitizeForExport(value) : value;
    return acc;
  }, {} as CitationFields);

  switch (format) {
    case 'bibtex':
      return exportFormats.bibtex(sanitizedFields);
    case 'ris':
      return exportFormats.ris(sanitizedFields);
    case 'apa':
    case 'mla':
    case 'chicago':
    case 'ieee':
    case 'harvard':
      return citationStyles[format](sanitizedFields);
    default:
      return '';
  }
}