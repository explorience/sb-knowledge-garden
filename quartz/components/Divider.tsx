import { QuartzComponent, QuartzComponentConstructor } from "./types"

const Divider: QuartzComponent = () => {
  return <hr />
}

Divider.displayName = "Divider"

Divider.css = `
hr {
  border: none;
  border-top: 1px solid var(--lightgray);
  margin: 2rem 0;
  width: 100%;
}
`

export default (() => Divider) satisfies QuartzComponentConstructor