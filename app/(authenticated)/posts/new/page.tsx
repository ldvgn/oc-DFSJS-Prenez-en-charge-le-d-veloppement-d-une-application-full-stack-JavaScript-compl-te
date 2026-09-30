import { authService } from "@/modules/auth/auth.service";
import { topicService } from "@/modules/topic/topic.service";
import PageHeader from "../../_components/page-header";
import PostForm from "./_components/post-form";

export default async function PostCreate() {
  await authService.requireUser();

  const topics = await topicService.getAll();

  return (
    <>
      <PageHeader
        title="Créer un nouvel article"
        backHref="/posts"
        align="center"
      />

      <div className="md:max-w-sm mx-auto mt-8">
        <PostForm topics={topics} />
      </div>
    </>
  );
}
