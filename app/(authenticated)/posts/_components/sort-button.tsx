"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { MoveDown, MoveUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SortButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const order = searchParams.get("order") === "asc" ? "asc" : "desc";

  const sortToggle = () => {
    router.replace(`/posts?order=${order === "asc" ? "desc" : "asc"}`);
  };

  return (
    <Button variant="ghost" onClick={sortToggle}>
      Trier par date {order === "asc" ? <MoveUp /> : <MoveDown />}
    </Button>
  );
}
