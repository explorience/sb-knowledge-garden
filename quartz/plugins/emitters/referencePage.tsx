import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import { pageResources, renderPage } from "../../components/renderPage"
import { ProcessedContent } from "../vfile"
import { FullPageLayout } from "../../cfg"
import { FilePath, pathToRoot } from "../../util/path"
import { sharedPageComponents, defaultContentPageLayout } from "../../../quartz.layout"
import { Content } from "../../components"
import * as Component from "../../components"
import { write } from "./helpers"
import DepGraph from "../../depgraph"
import { getLayoutForType } from "../../types/typeLayouts"

/**
 * Reference Page Emitter
 * 
 * Processes files in the 'reference' category (link, reference types).
 * Gracefully skips 'tag' and 'index' types which are handled by 
 * purpose-built TagPage and FolderPage emitters respectively.
 * Uses a unified layout with type-aware conditional sections.
 */
export const ReferencePage: QuartzEmitterPlugin<Partial<FullPageLayout>> = (userOpts) => {
  // Custom layout for all reference types
  const referenceLayoutOpts: FullPageLayout = {
    ...sharedPageComponents,
    beforeBody: [
      Component.Breadcrumbs(),
      Component.TitleWithTypeBadge(),
      Component.Description(),
    ],
    left: [
      Component.MobileOnly(Component.Spacer()),
      Component.DesktopOnly(Component.ConditionalRender({
        component: Component.TypeAwareLeftContent(),
        condition: (props) => {
          const type = props.fileData.frontmatter?.type as string | undefined
          const layout = getLayoutForType(type)
          // Only show if the type's layout defines left section content
          return layout && layout.left && layout.left.length > 0
        }
      })),
      Component.DesktopOnly(Component.Explorer({
        title: "Knowledge Garden",
      })),
    ],
    right: [
      Component.ConditionalRender({
        component: Component.TypeAwareRightContent(),
        condition: (props) => {
          const type = props.fileData.frontmatter?.type as string | undefined
          const layout = getLayoutForType(type)
          // Only show if the type's layout defines right section content
          return layout && layout.right && layout.right.length > 0
        }
      }),
      Component.DesktopOnly(Component.Graph()),
    ],
    afterBody: [
      Component.ConditionalRender({
        component: Component.TypeAwareAfterBody(),
        condition: (props) => {
          const type = props.fileData.frontmatter?.type as string | undefined
          const layout = getLayoutForType(type)
          // Only show if the type's layout defines afterBody content
          return layout && layout.afterBody && layout.afterBody.length > 0
        }
      }),
    ],
    pageBody: Content(),
    ...userOpts,
  }

  return {
    name: "ReferencePage",
    getQuartzComponents() {
      return [
        referenceLayoutOpts.head,
        ...referenceLayoutOpts.header,
        ...referenceLayoutOpts.beforeBody,
        referenceLayoutOpts.pageBody,
        ...referenceLayoutOpts.afterBody,
        ...referenceLayoutOpts.left,
        ...referenceLayoutOpts.right,
        referenceLayoutOpts.footer,
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

        const content = renderPage(cfg, slug, componentData, referenceLayoutOpts, externalResources)
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