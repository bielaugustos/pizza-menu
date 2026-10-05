import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Faça seu pedido | Pizzaria Choupana",
};

export default function PedidoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
