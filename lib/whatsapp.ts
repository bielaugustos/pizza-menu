import { brl } from "./menu";

export type CartLine = { id: string; name: string; price: number; qty: number };

export type PaymentMethod = "dinheiro" | "cartao" | "pix";

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  dinheiro: "Dinheiro na entrega",
  cartao: "Cartão na entrega",
  pix: "Pix",
};

export type OrderSummary = {
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  area: string;
  lines: CartLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  payment: PaymentMethod;
  changeFor?: string;
  notes?: string;
};

export function buildWhatsAppMessage(o: OrderSummary): string {
  const items = o.lines
    .map((l) => `• ${l.qty}x ${l.name} — ${brl(l.price * l.qty)}`)
    .join("\n");

  const parts = [
    `*Novo pedido #${o.orderNumber}*`,
    "",
    items,
    "",
    `Subtotal: ${brl(o.subtotal)}`,
    `Entrega (${o.area}): ${brl(o.deliveryFee)}`,
    `*Total: ${brl(o.total)}*`,
    "",
    `*Pagamento:* ${PAYMENT_LABEL[o.payment]}`,
  ];
  if (o.payment === "dinheiro" && o.changeFor) parts.push(`Troco para: ${o.changeFor}`);
  if (o.payment === "pix") parts.push("Vou enviar o comprovante do Pix aqui.");
  parts.push(
    "",
    `*Cliente:* ${o.customerName}`,
    `*Telefone:* ${o.phone}`,
    `*Endereço:* ${o.address} (${o.area})`
  );
  if (o.notes) parts.push(`*Observações:* ${o.notes}`);
  return parts.join("\n");
}

export function buildWhatsAppLink(shopNumber: string, message: string): string {
  return `https://wa.me/${shopNumber}?text=${encodeURIComponent(message)}`;
}
