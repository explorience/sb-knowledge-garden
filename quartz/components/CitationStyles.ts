import helpers from './CitationHelpers'
import { CitationFields } from './types'
import { ValidLocale } from "../i18n/locales/definition"

export const citationStyles = {
  apa: function(data) {
    const authors = data?.author ? helpers.apa.formatAuthors(data.author) : ''
    const year = data?.date ? helpers.apa.formatDate(data.date) : ''
    const title = data?.title || ''

    let citation = `${authors} (${year}). ${title}`

    const journalPart = data.journal?.trim()
    const volumePart = data.volume?.trim()
    const issuePart = data.issue?.trim()
    const pagesPart = data.pages?.trim()

    if (journalPart) {
      citation += `. ${journalPart}`
      if (volumePart) {
        citation += `, ${volumePart}`
        if (issuePart) {
          citation += `(${issuePart})`
        }
      }
      if (pagesPart) {
        citation += `, ${pagesPart}`
      }
    }

    return citation + '.'
  },

  mla: function(data) {
    const authors = helpers.mla.formatAuthors(data.author).replace(/\.+/g, '')
    const title = data?.title || ''
    const year = data?.date ? helpers.mla.formatDate(data.date) : ''

    let citation = `${authors}. "${title}"`

    const parts = []
    
    if ('journal' in data && data.journal) parts.push(data.journal)
    if ('volume' in data && data.volume) parts.push(`vol. ${data.volume}`)
    if ('issue' in data && data.issue) parts.push(`no. ${data.issue}`)
    if (year) parts.push(year)
    if ('pages' in data && data.pages) parts.push(`pp. ${data.pages}`)

    if (parts.length > 0) {
      citation += `, ${parts.join(', ')}`
    }

    return citation + '.'
  },

  chicago: function(data) {
    const authors = helpers.chicago.formatAuthors(data.author)
    const title = data?.title || ''
    const year = data?.date ? helpers.chicago.formatDate(data.date) : ''

    let citation = `${authors}. "${title}."`

    const journalPart = data.journal?.trim()
    const volumePart = data.volume?.trim()
    const issuePart = data.issue?.trim()
    const pagesPart = data.pages?.trim()

    if (journalPart) {
      citation += ` ${journalPart}`
      if (volumePart) {
        citation += ` ${volumePart}`
        if (issuePart) citation += `, no. ${issuePart}`
      }
    }

    if (year) citation += ` (${year})`
    if (pagesPart) citation += `: ${pagesPart}`

    return citation + '.'
  },

  harvard: function(data) {
    const authors = helpers.harvard.formatAuthors(data.author)
    const year = data?.date ? helpers.harvard.formatDate(data.date) : ''
    const title = data?.title || ''
    
    let citation = `${authors}, ${year}. ${title}`
    
    if (data.journal) {
      citation += `. ${data.journal}`
      if (data.volume) {
        citation += `, ${data.volume}`
        if (data.issue) citation += `(${data.issue})`
      }
      if (data.pages) {
        citation += `, pp.${data.pages}`
      }
    }
    
    return citation + '.'
  },

  ieee: function(data) {
    const authors = helpers.ieee.formatAuthors(data.author)
    const title = data?.title || ''
    const year = data?.date ? helpers.ieee.formatDate(data.date) : ''
    
    let citation = `${authors}, "${title}"`

    if (data.journal) {
      citation += `, ${data.journal}`
    }
    
    if (data.volume) {
      citation += `, vol. ${data.volume}`
    }
    if (data.issue) {
      citation += `, no. ${data.issue}`
    }
    if (data.pages) {
      citation += `, pp. ${data.pages}`
    }
    if (year) {
      citation += `, ${year}`
    }

    return citation + '.'
  }
}

export default citationStyles 