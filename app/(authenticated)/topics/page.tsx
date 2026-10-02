import { authService } from "@/modules/auth/auth.service";
import { topicService } from "@/modules/topic/topic.service";
import { TopicCard } from "./_components/topic-card";

export default async function Topics() {
  const user = await authService.requireUser();

  const topics = await topicService.getAllWithUserSubscription(user.id);

  return (
    <>
      <h1 className="sr-only">Thèmes</h1>

      {topics.length === 0 ? (
        <p>Aucun thème pour le moment.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {topics.map((topic) => (
            <li key={topic.id}>
              <TopicCard topic={topic} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
