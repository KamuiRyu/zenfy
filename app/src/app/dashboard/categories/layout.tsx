import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories - Zenfy",
  description: "Manage your categories",
};

export default function CategoriesLayout({ children, modal }: { children: React.ReactNode, modal: React.ReactNode }) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}