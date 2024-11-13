import { ReactNode } from "react";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

type Props = {
  children: ReactNode;
  showHero?: boolean;
};

function Layout({ children, showHero = false }: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {showHero && <Hero />}
      <div className="container mx-auto flex-1 px-2 py-10">{children}</div>
      <Footer />
    </div>
  );
}

export default Layout;
