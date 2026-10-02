import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { postService } from "@/modules/post/post.service";
import { SortButton } from "./_components/sort-button";
import { authService } from "@/modules/auth/auth.service";
import { PostCard } from "./_components/post-card";

export default async function Posts({ searchParams }: PageProps<"/posts">) {
  const user = await authService.requireUser();

  const { order: orderParam } = await searchParams;
  const order = orderParam === "asc" ? "asc" : "desc";
  const posts = await postService.getFeed(user.id, order);

  return (
    <>
      <h1 className="sr-only">Fil d&apos;actualité</h1>

      <div className="pb-8 flex justify-between items-center">
        <Link href="/posts/new" className={buttonVariants()}>
          Créer un article
        </Link>

        <SortButton />
      </div>

      {posts.length === 0 ? (
        <p>
          Aucun article pour le moment.{" "}
          <Link href="/topics" className="underline">
            Abonnez-vous à des thèmes
          </Link>{" "}
          pour voir leurs articles.
        </p>
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
