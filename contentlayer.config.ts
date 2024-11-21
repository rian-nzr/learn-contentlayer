import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import { writeFileSync } from "fs";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { remarkAlert } from "remark-github-blockquote-alert";
import {
  remarkExtractFrontmatter,
  remarkCodeTitles,
  remarkImgToJsx,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  extractTocHeadings,
} from "pliny/mdx-plugins/index.js";
// Rehype packages
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
// import rehypeCitation from 'rehype-citation'
import rehypePrismPlus from "rehype-prism-plus";
import rehypePresetMinify from "rehype-preset-minify";
import rehypeCitation from "rehype-citation";
import path from "path";
interface Post {
  title: string;
  slug: string;
  category: string;
  section: string;
}

// Define the structure of the category list
interface CategoryList {
  [category: string]: {
    [section: string]: Array<{ title: string; slug: string }>;
  };
}
const root = process.cwd();

function createCategory(allPosts: any): void {
  let categoryList: CategoryList = {};

  allPosts.forEach((file: any) => {
    const currentCategory = file.category;
    const currentSection = file.section;

    if (currentCategory in categoryList) {
      if (currentSection in categoryList[currentCategory]) {
        console.log("currentSection", currentSection);
        console.log(file.title);

        // Append to the existing section
        categoryList[currentCategory][currentSection].push({
          title: file.title,
          slug: file.slug,
        });
      } else {
        console.log(file.title, currentSection);

        // Create a new section under the existing category
        categoryList[currentCategory][currentSection] = [
          {
            title: file.title,
            slug: file.slug,
          },
        ];
      }
    } else {
      // Create a new category with a new section
      categoryList[currentCategory] = {
        [currentSection]: [
          {
            title: file.title,
            slug: file.slug,
          },
        ],
      };
    }
  });

  writeFileSync(
    "./src/app/category-data.json",
    JSON.stringify(categoryList, null, 2)
  );
  console.log("Category list generated...");
}

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    summary: { type: "string", required: true },
    category: { type: "string" },
    section: { type: "string" },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (post) => `/posts/${post._raw.flattenedPath}`,
    },
  },
}));

export default makeSource({
  contentDirPath: "posts",
  documentTypes: [Post],
  mdx: {
    cwd: process.cwd(),
    remarkPlugins: [
      remarkExtractFrontmatter,
      remarkGfm,
      remarkCodeTitles,
      remarkMath,
      remarkImgToJsx,
      remarkAlert,
    ],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "prepend",
          headingProperties: {
            className: ["content-header"],
          },
        },
      ],
      rehypeKatex,
      [rehypeCitation, { path: path.join(root, "data") }],
      [rehypePrismPlus, { defaultLanguage: "js", ignoreMissing: true }],
      rehypePresetMinify,
    ],
  },
  onSuccess: async (importData) => {
    const { allPosts } = await importData();
    createCategory(allPosts);
  },
});
