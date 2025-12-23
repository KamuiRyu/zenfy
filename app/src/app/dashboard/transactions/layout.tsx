import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transactions - Zenfy",
  description: "Manage your transactions",
};

export default function TransactionsLayout({ children, modal }: { children: React.ReactNode, modal: React.ReactNode }) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}