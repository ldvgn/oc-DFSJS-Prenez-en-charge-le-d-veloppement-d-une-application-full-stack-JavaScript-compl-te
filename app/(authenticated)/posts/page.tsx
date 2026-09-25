import { auth } from "@/lib/auth";

export default async function Posts() {
  const session = await auth();
  console.log(session);

  return <pre>{JSON.stringify(session, null, 2)}</pre>;
}
