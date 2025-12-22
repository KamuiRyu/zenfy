import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My cards - Zenfy",
  description: "Manage your cards",
};

export default function CardsLayout({ children, modal }: { children: React.ReactNode, modal: React.ReactNode }) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}