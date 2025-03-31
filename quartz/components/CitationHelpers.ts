interface AuthorName {
  family: string
  given: string
}

// Parse author string into structured format
function parseAuthor(author: string): AuthorName {
  const parts = author.split(' ')
  return {
    family: parts[parts.length - 1],
    given: parts.slice(0, -1).join(' ')
  }
}

// Helper functions for each citation style
const helpers = {
  // APA Helpers
  apa: {
    formatAuthors: (author: string | string[]): string => {
      if (typeof author === 'string') author = [author]
      const parsedAuthors = author.map(parseAuthor)
      
      if (parsedAuthors.length === 1) {
        return `${parsedAuthors[0].family}, ${parsedAuthors[0].given.split(' ').map(n => n[0] + '.').join(' ')}`
      } else if (parsedAuthors.length === 2) {
        return `${parsedAuthors[0].family}, ${parsedAuthors[0].given.charAt(0)}., & ${parsedAuthors[1].family}, ${parsedAuthors[1].given.charAt(0)}.`
      } else if (parsedAuthors.length > 2) {
        return `${parsedAuthors[0].family}, ${parsedAuthors[0].given.charAt(0)}., et al.`
      }
      return ''
    },
    formatDate: (date: string): string => {
      return new Date(date).getFullYear().toString()
    }
  },

  // MLA Helpers
  mla: {
    formatAuthors: (author: string | string[]): string => {
      if (!author) return '';
      if (typeof author === 'string') {
        const parts = author.split(' ');
        const lastName = parts[parts.length - 1];
        const firstName = parts.slice(0, -1).join(' ');
        return `${lastName}, ${firstName}`.replace(/\./g, '');
      }
      return Array.isArray(author) 
        ? author.map(a => {
            const parts = a.split(' ');
            const lastName = parts[parts.length - 1];
            const firstName = parts.slice(0, -1).join(' ');
            return `${lastName}, ${firstName}`.replace(/\./g, '');
          }).join(', and ')
        : author.replace(/\./g, '');
    },

    formatDate: (date: string): string => {
      return new Date(date).getFullYear().toString();
    }
  },

  // Chicago Helpers
  chicago: {
    formatAuthors: (author: string | string[]): string => {
      if (!author) return '';
      if (typeof author === 'string') {
        const parts = author.split(' ');
        const lastName = parts[parts.length - 1];
        const firstName = parts.slice(0, -1).join(' ');
        return `${lastName}, ${firstName}`;
      }
      return Array.isArray(author) 
        ? author.map(a => {
            const parts = a.split(' ');
            const lastName = parts[parts.length - 1];
            const firstName = parts.slice(0, -1).join(' ');
            return `${lastName}, ${firstName}`;
          }).join(' and ')
        : author;
    },

    formatDate: (date: string): string => {
      return new Date(date).toLocaleDateString('en-US', { 
        month: 'long',
        year: 'numeric'
      })
    }
  },

  // IEEE Helpers
  ieee: {
    formatAuthors: (author: string | string[]): string => {
      if (typeof author === 'string') {
        const parts = author.split(' ')
        // Take first letter of each name except last name
        const initials = parts.slice(0, -1).map(name => `${name[0].toUpperCase()}.`).join(' ')
        const lastName = parts[parts.length - 1]
        return `${initials} ${lastName}`
      }
      
      // Handle array of authors if needed
      return Array.isArray(author) 
        ? author.map(a => {
            const parts = a.split(' ')
            const initials = parts.slice(0, -1).map(name => `${name[0].toUpperCase()}.`).join(' ')
            const lastName = parts[parts.length - 1]
            return `${initials} ${lastName}`
          }).join(", ")
        : ''
    },

    formatDate: (date: string): string => {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      })
    }
  },

  // Harvard Helpers
  harvard: {
    formatAuthors: (author: string | string[]): string => {
      if (typeof author === 'string') author = [author]
      const parsedAuthors = author.map(parseAuthor)
      
      if (parsedAuthors.length === 1) {
        const initials = parsedAuthors[0].given
          .split(' ')
          .map(n => n[0].toUpperCase())
          .join('')
        return `${parsedAuthors[0].family}, ${initials}.`
      } else if (parsedAuthors.length === 2) {
        const author1 = `${parsedAuthors[0].family}, ${parsedAuthors[0].given.split(' ').map(n => n[0].toUpperCase()).join('')}.`
        const author2 = `${parsedAuthors[1].family}, ${parsedAuthors[1].given.split(' ').map(n => n[0].toUpperCase()).join('')}.`
        return `${author1} and ${author2}`
      } else if (parsedAuthors.length > 2) {
        return `${parsedAuthors[0].family}, ${parsedAuthors[0].given.split(' ').map(n => n[0].toUpperCase()).join('')}. et al.`
      }
      return ''
    },
    formatDate: (date: string): string => {
      return new Date(date).getFullYear().toString()
    }
  }
}

export default helpers 