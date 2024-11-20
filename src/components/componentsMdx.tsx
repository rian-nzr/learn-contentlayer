import Pre from "pliny/ui/Pre.js";
import BlogNewsletterForm from "pliny/ui/BlogNewsletterForm.js";
import type { MDXComponents } from "mdx/types";
import Image from "./Image";
import CustomLink from "./Link";
import TableWrapper from "./TableWrapper";
import TOCInline from "pliny/ui/TOCInline.js";

// Mendeklarasikan komponen MDX
export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  BlogNewsletterForm,
};