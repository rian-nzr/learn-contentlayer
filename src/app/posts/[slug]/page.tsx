import '../../prism.css'
import 'katex/dist/katex.css'

import { components } from "@/components/componentsMdx";
import Mdx from "@/components/mdx-components";
import { allPosts } from "contentlayer/generated";
import { format, parseISO } from "date-fns";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getMDXComponent } from "next-contentlayer2/hooks";
import { MDXLayoutRenderer } from "pliny/mdx-components.js";

interface PostPageProps {
  params: {
    slug: string;
  };
}

export default function PostPage({ params }: PostPageProps) {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);

  if (!post?.body.code) {
    return <div>Post not found</div>;
  }

  return (
    <article className="py-8 mx-auto prose max-w-3xl pb-8 pt-10 dark:prose-invert">
      <div className="mb-8 text-center">
        <time dateTime={post.date}>
          {format(parseISO(post.date), "LLLL d, yyyy")}
        </time>
        <h1>{post.title} </h1>
      </div>
      {/* <Mdx code={post.body.code} /> */}
      <MDXLayoutRenderer code={post.body.code} components={components} />
    </article>
  );
}
