import { notFound } from "next/navigation";
import { authService } from "@/modules/auth/auth.service";
import { postService } from "@/modules/post/post.service";
import { PostMeta } from "../_components/post-meta";
import PageHeader from "../../_components/page-header";
import CommentForm from "./_components/comment-form";

export default async function Post({ params }: PageProps<"/posts/[id]">) {
  await authService.requireUser();

  const { id } = await params;
  const post = await postService.getById(id);

  if (!post) notFound();

  return (
    <>
      <PageHeader title={post.title} titleId="post-title" backHref="/posts" />

      <div className="divide-y">
        <article
          className="space-y-4 py-4 md:pb-8"
          aria-labelledby="post-title"
        >
          <PostMeta
            createdAt={post.createdAt}
            author={post.author.username}
            topic={post.topic.name}
          />

          <p className="whitespace-pre-line wrap-break-word">{post.content}</p>
        </article>

        <section
          aria-labelledby="comments-title"
          className="py-4 md:py-8 space-y-8"
        >
          <h2 id="comments-title">Commentaires</h2>

          <div className="space-y-8">
            {post.comments.length === 0 ? (
              <p className="text-center">Aucun commentaire pour le moment.</p>
            ) : (
              <ul className="space-y-2">
                {post.comments.map((comment) => (
                  <li key={comment.id}>
                    <article className="grid grid-cols-10 gap-8">
                      <div className="col-span-10 lg:col-span-2 lg:col-start-1 text-end">
                        <span className="capitalize">
                          {comment.author.username}
                        </span>
                      </div>
                      <div className="col-span-10 lg:col-span-7 bg-neutral-200 rounded-lg">
                        <p className="p-4 min-h-25 whitespace-pre-line wrap-break-word">
                          {comment.content}
                        </p>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            )}
            <CommentForm postId={post.id} />
          </div>
        </section>
      </div>
    </>
  );
}
