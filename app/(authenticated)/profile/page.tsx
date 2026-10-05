import { TopicCard } from "@/components/shared/topic-card";
import { authService } from "@/modules/auth/auth.service";
import { topicService } from "@/modules/topic/topic.service";
import ProfileForm from "./_components/profile-form";
import { UnsubscribeButton } from "./_components/unsubscribe-button";
import PageHeader from "../_components/page-header";

export default async function Profile() {
  const user = await authService.requireUser();

  const topics = await topicService.getSubscribedByUser(user.id);

  return (
    <>
      <PageHeader title="Profil utilisateur" backHref="/posts" align="center" />

      <div className="divide-y">
        <div className="py-4 md:pb-8">
          <div className="md:max-w-sm mx-auto mt-8">
            <ProfileForm username={user.username ?? ""} email={user.email} />
          </div>
        </div>

        <section
          aria-labelledby="subscriptions-title"
          className="pt-8 space-y-8"
        >
          <h2 id="subscriptions-title" className="text-center">
            Abonnements
          </h2>
          {topics.length === 0 ? (
            <p className="text-center">Aucun abonnement pour le moment.</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {topics.map((topic) => (
                <li key={topic.id}>
                  <TopicCard topic={topic}>
                    <UnsubscribeButton topicId={topic.id} />
                  </TopicCard>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
