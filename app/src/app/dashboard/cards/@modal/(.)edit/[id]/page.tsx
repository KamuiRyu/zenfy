"use client";
import { useRouter, useParams } from "next/navigation";
import EditCardDialog from "@/components/dashboard/cards/my_cards/edit/edit_card_dialog";
import { toast } from "sonner";

export default function EditCardModal() {
  const router = useRouter();
  const { id } = useParams();
  const cardId = Array.isArray(id) ? id[0] : id;

  if (!cardId) {
    toast.error("ID do cartão inválido");
    return router.back();
  }

  return (
    <EditCardDialog cardId={cardId} />
  );
}