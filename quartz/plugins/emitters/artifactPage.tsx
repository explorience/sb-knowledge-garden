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
 * Artifact Page Emitter
 * 
 * Processes all files in the 'artifact' category (pattern, playbook, study, article, guide, protocol types).
 * Uses a unified layout optimized for all artifact types with breadcrumbs + type badge, description, etc.
 */
export const ArtifactPage: QuartzEmitterPlugin<Partial<FullPageLayout>> = (userOpts) => {
  // Custom layout for all artifacts
  const artifactLayoutOpts: FullPageLayout = {
    ...sharedPageComponents,
    beforeBody: [
      Component.Breadcrumbs(),
      Component.CoverImage(),
      Component.TitleWithTypeBadge(),
      Component.ContentMeta(),
      Component.Description(),
      Component.TagList(),
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
    ],
    right: [
      Component.DesktopOnly(Component.TableOfContents()),
      Component.ConditionalRender({
        component: Component.TypeAwareRightContent(),
        condition: (props) => {
          const type = props.fileData.frontmatter?.type as string | undefined
          const layout = getLayoutForType(type)
          // Only show if the type's layout defines right section content
          return layout && layout.right && layout.right.length > 0
        }
      }),
    ],
    pageBody: Content(),
    ...userOpts,
  }

  return {
    name: "ArtifactPage",
    getQuartzComponents() {
      return [
        artifactLayoutOpts.head,
        ...artifactLayoutOpts.header,
        ...artifactLayoutOpts.beforeBody,
        artifactLayoutOpts.pageBody,
        ...artifactLayoutOpts.afterBody,
        ...artifactLayoutOpts.left,
        ...artifactLayoutOpts.right,
        artifactLayoutOpts.footer,
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

        const content = renderPage(cfg, slug, componentData, artifactLayoutOpts, externalResources)
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