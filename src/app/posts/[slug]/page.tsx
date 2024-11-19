// import '../../prism.css'

import Mdx from '@/components/mdx-components';
import { allPosts } from 'contentlayer/generated';
import { format, parseISO } from 'date-fns';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getMDXComponent } from 'next-contentlayer2/hooks';
 
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
    <article className='py-8 mx-auto max-w-xl'>
      <div className='mb-8 text-center'>
        <time dateTime={post.date}>
          {format(parseISO(post.date), 'LLLL d, yyyy')}
        </time>
        <h1>{post.title}</h1>
      </div>
      <Mdx code={post.body.code} />
    </article>
  );
}