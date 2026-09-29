import Link from "next/link";
import { Button } from "@/components/ui/button";
import { postService } from "@/modules/post/post.service";
import { SortButton } from "./_components/sort-button";
import { authService } from "@/modules/auth/auth.service";
import { PostCard } from "./_components/post-card";

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
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {posts.map((post) => (
            <li key={post.id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
