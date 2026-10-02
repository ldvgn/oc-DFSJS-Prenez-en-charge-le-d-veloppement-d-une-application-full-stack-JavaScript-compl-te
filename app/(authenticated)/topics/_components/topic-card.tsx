import type { TopicWithSubscriptions } from "@/modules/topic/topic.schemas";
import { SubscribeButton } from "./subscribe-button";

export function TopicCard({ topic }: { topic: TopicWithSubscriptions }) {
  return (
    <article className="flex flex-col gap-4 p-4 bg-neutral-100 rounded-lg h-full">
      <h2>{topic.name}</h2>
      <p className="line-clamp-3 grow">Description : {topic.description}</p>
      <div className="flex justify-center">
        <SubscribeButton
          topicId={topic.id}
          subscribed={topic.subscriptions.length > 0}
        />
      </div>
    </article>
  );
}
