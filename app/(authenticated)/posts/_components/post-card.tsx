import Link from "next/link";
import type { PostWithAuthor } from "@/modules/post/post.schemas";
import { PostMeta } from "./post-meta";

export function PostCard({ post }: { post: PostWithAuthor }) {
  return (
    <article className="relative space-y-4 p-4 bg-neutral-100 rounded-lg h-full hover:bg-neutral-200">
      <h2>
        <Link
          href={`/posts/${post.id}`}
          className="after:absolute after:inset-0"
        >
          {post.title}
        </Link>
      </h2>
      <PostMeta createdAt={post.createdAt} author={post.author.username} />
      <p className="line-clamp-4">{post.content}</p>
    </article>
  );
}
