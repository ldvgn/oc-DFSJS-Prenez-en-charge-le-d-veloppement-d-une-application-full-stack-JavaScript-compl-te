import { topicService } from "@/modules/topic/topic.service";
import PageHeader from "../../_components/page-header";
import PostForm from "./_components/post-form";

export default async function PostCreate() {
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
