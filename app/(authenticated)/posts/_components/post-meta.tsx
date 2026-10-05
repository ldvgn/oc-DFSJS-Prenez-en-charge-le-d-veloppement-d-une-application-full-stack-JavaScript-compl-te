type PostMetaProps = {
  author: string;
  createdAt?: Date;
  topic?: string;
};

export function PostMeta({ createdAt, author, topic }: Readonly<PostMetaProps>) {
  return (
    <div className="flex gap-8">
      {createdAt && (
        <time dateTime={createdAt.toISOString()}>
          {createdAt.toLocaleDateString("fr-FR")}
        </time>
      )}
      <span className="capitalize">{author}</span>
      {topic && <span className="capitalize">{topic}</span>}
    </div>
  );
}
