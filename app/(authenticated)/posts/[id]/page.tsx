import { notFound } from "next/navigation";
import { postService } from "@/modules/post/post.service";
import { PostMeta } from "../_components/post-meta";
import PageHeader from "../../_components/page-header";

export default async function Post({ params }: PageProps<"/posts/[id]">) {
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

          <p>{post.content}</p>
        </article>

        <section aria-labelledby="comments-title" className="py-4 md:py-8">
          <h2 id="comments-title" className="mb-8">
            Commentaires
          </h2>
          {post.comments.length === 0 ? (
            <p>Aucun commentaire pour le moment.</p>
          ) : (
            <div className="max-w-4xl mx-auto">
              <ul className="space-y-4">
                {post.comments.map((comment) => (
                  <li key={comment.id}>
                    <article className="flex flex-col items-end md:flex-row md:items-start md:gap-8 md:px-8">
                      <PostMeta author={comment.author.username} />
                      <p className="bg-neutral-200 p-4 rounded-lg min-h-25 w-full">
                        {comment.content}
                      </p>
                    </article>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
