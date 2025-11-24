---
limit: 50
mapWithTag: false
icon: package-open
tagNames:
filesPaths:
  - artifacts/reimagining-power
  - artifacts/dao-primitives
  - artifacts/governance-futures
  - artifacts/windfall-protocol
bookmarksGroups:
excludes:
extends: artifact
savedViews: []
favoriteView:
fieldsOrder:
  - releaseDate
  - relatedReleases
version: "2.107"
fields:
  - name: releaseDate
    type: Date
    options: {}
    path: ""
    id: releaseDate
  - name: relatedReleases
    type: MultiFile
    options:
      dvQueryString: |-
        dv.pages().where(p => {
          if (!p.publish || (p.publish != true && p.publish != "true")) return false;
          if (!p.type) return false;
          return p.type === "release" || (Array.isArray(p.type) && p.type.includes("release"));
        })
      customRendering: 'page.file.name'
      customSorting: a.file.name.localeCompare(b.file.name)
    path: ""
    id: relatedReleases
---
The Release type represents a curated collection of related artifacts organized around a specific project, initiative, or thematic series. Releases transform individual artifacts into coherent knowledge packages that tell a complete story about a body of work.

Extending Artifact, Releases serve as navigational hubs that organize multiple content types (articles, guides, patterns, studies, playbooks) into project-focused or series-based presentations. They provide context and structure for understanding how individual pieces of knowledge relate to a larger initiative or research program.

Stored in project-specific directories under `/artifacts/` (e.g., `/artifacts/reimagining-power/`, `/artifacts/dao-primitives/`), each release contains an index page that showcases its contents with rich presentation including cards, descriptions, and visual assets. Releases enable visitors to explore complete bodies of work rather than encountering isolated artifacts.

Key releases include:
- **Reimagining Power Project**: Exploring web3 for power redistribution in philanthropy
- **DAO Primitives Framework**: Comprehensive framework for decentralized organization design
- **Governance for Better Futures**: Article series exploring evolving governance models
- **Windfall Protocol**: (Forthcoming) Protocol documentation and implementation guides

**Template**: release-index.md (to be created)
