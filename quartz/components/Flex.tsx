import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

type FlexConfig = {
  components: QuartzComponent[]
  direction?: "row" | "row-reverse" | "column" | "column-reverse"
  wrap?: "nowrap" | "wrap" | "wrap-reverse"
  gap?: string
  grow?: boolean[]
  shrink?: boolean[]
  basis?: string[]
  order?: number[]
  align?: "start" | "end" | "center" | "stretch"
  justify?: "start" | "end" | "center" | "between" | "around" | "evenly"
}

export default ((config: FlexConfig) => {
  const Flex: QuartzComponent = (props: QuartzComponentProps) => {
    const direction = config.direction ?? "row"
    const wrap = config.wrap ?? "nowrap"
    const gap = config.gap ?? "1rem"
    const align = config.align ?? "stretch"
    const justify = config.justify ?? "start"

    const justifyMap = {
      start: "flex-start",
      end: "flex-end",
      center: "center",
      between: "space-between",
      around: "space-around",
      evenly: "space-evenly",
    }

    return (
      <div
        class={classNames(props.displayClass, "flex-component")}
        style={`display: flex; flex-direction: ${direction}; flex-wrap: ${wrap}; gap: ${gap}; align-items: ${align}; justify-content: ${justifyMap[justify]};`}
      >
        {config.components.map((Component, index) => {
          const grow = config.grow?.[index] ? 1 : 0
          const shrink = (config.shrink?.[index] ?? true) ? 1 : 0
          const basis = config.basis?.[index] ?? "auto"
          const order = config.order?.[index] ?? 0

          return (
            <div
              key={index}
              style={`flex-grow: ${grow}; flex-shrink: ${shrink}; flex-basis: ${basis}; order: ${order};`}
            >
              <Component {...props} />
            </div>
          )
        })}
      </div>
    )
  }

  Flex.css = `
    .flex-component {
      width: 100%;
    }
    
    @media (max-width: 800px) {
      .flex-component[style*="flex-direction: row"] {
        flex-direction: column !important;
      }
      .flex-component[style*="flex-direction: row-reverse"] {
        flex-direction: column-reverse !important;
      }
    }
  `

  return Flex
}) satisfies QuartzComponentConstructor