import Link from "next/link";
import { Button } from "@/components/ui/button";
import { postService } from "@/modules/post/post.service";
import { SortButton } from "./_components/sort-button";
import { authService } from "@/modules/auth/auth.service";

export default async function Posts({ searchParams }: PageProps<"/posts">) {
  await authService.requireUser();

  const { order: orderParam } = await searchParams;
  const order = orderParam === "asc" ? "asc" : "desc";
  const posts = await postService.getAll(order);

  return (
    <>
      <div className="pb-8 flex justify-between items-center">
        <Button nativeButton={false} render={<Link href="/posts/new" />}>
          Créer un article
        </Button>

        <SortButton />
      </div>

      {posts.length === 0 ? (
        <p>Aucun article pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/posts/${post.id}`}>
              <article className="space-y-4 p-4 bg-neutral-100 rounded-lg h-full hover:bg-neutral-200">
                <h2>{post.title}</h2>
                <div className="flex gap-8">
                  <time dateTime={post.createdAt.toISOString()}>
                    {post.createdAt.toLocaleDateString("fr-FR")}
                  </time>
                  <span className="capitalize">{post.author.username}</span>
                </div>
                <p className="line-clamp-4">{post.content}</p>
              </article>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
