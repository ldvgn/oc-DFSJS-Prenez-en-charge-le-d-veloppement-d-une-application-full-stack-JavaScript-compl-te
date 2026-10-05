import type { Topic } from "@/prisma/generated/prisma/client";

type TopicCardProps = {
  topic: Topic;
  children: React.ReactNode;
};

export function TopicCard({ topic, children }: TopicCardProps) {
  return (
    <article className="flex flex-col gap-4 p-4 bg-neutral-100 rounded-lg h-full">
      <h2>{topic.name}</h2>
      <p className="line-clamp-3 grow">Description : {topic.description}</p>
      <div className="flex justify-center">{children}</div>
    </article>
  );
}
