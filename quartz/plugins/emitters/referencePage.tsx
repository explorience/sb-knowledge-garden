import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import { pageResources, renderPage } from "../../components/renderPage"
import { ProcessedContent } from "../vfile"
import { FullPageLayout } from "../../cfg"
import { FilePath, pathToRoot } from "../../util/path"
import { sharedPageComponents, defaultContentPageLayout } from "../../../quartz.layout"
import { TypeAwareReferenceContent } from "../../components"
import { write } from "./helpers"
import DepGraph from "../../depgraph"

/**
 * Reference Page Emitter
 * 
 * Processes files in the 'reference' category (link, reference types).
 * Gracefully skips 'tag' and 'index' types which are handled by 
 * purpose-built TagPage and FolderPage emitters respectively.
 */
export const ReferencePage: QuartzEmitterPlugin<Partial<FullPageLayout>> = (userOpts) => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    ...defaultContentPageLayout,
    pageBody: TypeAwareReferenceContent(),
    ...userOpts,
  }

  const { head: Head, header, beforeBody, pageBody, afterBody, left, right, footer: Footer } = opts

  return {
    name: "ReferencePage",
    getQuartzComponents() {
      return [
        Head,
        ...header,
        ...beforeBody,
        pageBody,
        ...afterBody,
        ...left,
        ...right,
        Footer,
      ]
    },
    async getDependencyGraph(ctx, content, _resources) {
      // Same as ContentPage - we don't add special dependencies
      return new DepGraph<FilePath>()
    },
    async emit(ctx, content, resources) {
      const cfg = ctx.cfg.configuration
      const fps: FilePath[] = []
      const allFiles = content.map((c) => c[1].data)

      for (const [tree, file] of content) {
        // Only process files that have been detected as "reference" category
        if (file.data.typeCategory !== "reference") {
          continue
        }

        // Skip types that are handled by purpose-built emitters
        const detectedType = file.data.detectedType
        if (detectedType === "tag" || detectedType === "index") {
          continue // TagPage and FolderPage emitters handle these
        }

        const slug = file.data.slug!
        const externalResources = pageResources(pathToRoot(slug), resources)
        const componentData: QuartzComponentProps = {
          ctx,
          fileData: file.data,
          externalResources,
          cfg,
          children: [],
          tree,
          allFiles,
        }

        const content = renderPage(cfg, slug, componentData, opts, externalResources)
        const fp = await write({
          ctx,
          content,
          slug,
          ext: ".html",
        })

        fps.push(fp)
      }

      console.log(`[ReferencePage] Processed ${fps.length} reference files`)
      return fps
    },
  }
}