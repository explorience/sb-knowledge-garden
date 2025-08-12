import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import { pageResources, renderPage } from "../../components/renderPage"
import { ProcessedContent } from "../vfile"
import { FullPageLayout } from "../../cfg"
import { FilePath, pathToRoot } from "../../util/path"
import { sharedPageComponents, defaultContentPageLayout } from "../../../quartz.layout"
import { TypeAwareArtifactContent } from "../../components"
import { write } from "./helpers"
import DepGraph from "../../depgraph"

/**
 * Artifact Page Emitter
 * 
 * Processes all files in the 'artifact' category (pattern, playbook, study, article, guide, protocol types).
 * Uses the default layout for now - will be enhanced with TypeAware components later.
 */
export const ArtifactPage: QuartzEmitterPlugin<Partial<FullPageLayout>> = (userOpts) => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    ...defaultContentPageLayout,
    pageBody: TypeAwareArtifactContent(),
    ...userOpts,
  }

  const { head: Head, header, beforeBody, pageBody, afterBody, left, right, footer: Footer } = opts

  return {
    name: "ArtifactPage",
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
        // Only process files that have been detected as "artifact" category
        if (file.data.typeCategory !== "artifact") {
          continue
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

      console.log(`[ArtifactPage] Processed ${fps.length} artifact files`)
      return fps
    },
  }
}