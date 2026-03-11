// CSS modules — TypeScript needs to know that importing .css yields a string-keyed record
declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}

declare module "*.css" {
  const content: string;
  export default content;
}

// Docusaurus virtual modules — these don't exist on disk, Docusaurus resolves them at build time
declare module "@docusaurus/Link" {
  import type { ComponentProps } from "react";
  export default function Link(
    props: ComponentProps<"a"> & { to?: string },
  ): JSX.Element;
}

declare module "@theme/Layout" {
  import type { ReactNode } from "react";
  export default function Layout(props: {
    title?: string;
    description?: string;
    children: ReactNode;
  }): JSX.Element;
}

declare module "@docusaurus/Translate" {
  import type { ReactNode } from "react";
  export default function Translate(props: {
    id?: string;
    values?: Record<string, ReactNode>;
    children?: string;
  }): JSX.Element;
  export function translate(config: {
    id?: string;
    message: string;
  }): string;
}
