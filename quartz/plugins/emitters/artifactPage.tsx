import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import { pageResources, renderPage } from "../../components/renderPage"
import { ProcessedContent } from "../vfile"
import { FullPageLayout } from "../../cfg"
import { FilePath, pathToRoot } from "../../util/path"
import { sharedPageComponents, defaultContentPageLayout } from "../../../quartz.layout"
import { Content } from "../../components"
import { write } from "./helpers"
import DepGraph from "../../depgraph"
import { getLayoutForType } from "../../types/typeLayouts"

/**
 * Artifact Page Emitter
 * 
 * Processes all files in the 'artifact' category (pattern, playbook, study, article, guide, protocol types).
 * Uses type-specific layouts from typeLayouts.ts for each content type.
 */
export const ArtifactPage: QuartzEmitterPlugin<Partial<FullPageLayout>> = (userOpts) => {
  // Default layout fallback
  const defaultOpts: FullPageLayout = {
    ...sharedPageComponents,
    ...defaultContentPageLayout,
    pageBody: Content(),
    ...userOpts,
  }

  return {
    name: "ArtifactPage",
    getQuartzComponents() {
      // Return all possible components that might be used across all layouts
      // The actual components used will be determined per-file in emit()
      return [
        defaultOpts.head,
        ...defaultOpts.header,
        ...defaultOpts.beforeBody,
        defaultOpts.pageBody,
        ...defaultOpts.afterBody,
        ...defaultOpts.left,
        ...defaultOpts.right,
        defaultOpts.footer,
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
        const detectedType = file.data.detectedType
        
        // Get type-specific layout or fall back to default
        const typeLayout = getLayoutForType(detectedType)
        const layoutOpts: FullPageLayout = typeLayout ? {
          ...sharedPageComponents,
          ...typeLayout,
          pageBody: Content(),
          ...userOpts,
        } : defaultOpts

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

        const content = renderPage(cfg, slug, componentData, layoutOpts, externalResources)
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