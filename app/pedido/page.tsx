"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CATEGORIES, DELIVERY_AREAS, MENU, brl } from "@/lib/menu";
import {
  PAYMENT_LABEL,
  PaymentMethod,
  buildWhatsAppLink,
  buildWhatsAppMessage,
} from "@/lib/whatsapp";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
const PIX_KEY = process.env.NEXT_PUBLIC_PIX_KEY ?? "";
const PIX_NAME = process.env.NEXT_PUBLIC_PIX_NAME ?? "Pizzaria Choupana";

export default function Home() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [checkout, setCheckout] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ link: string; orderNumber: string; total: number; pix: boolean } | null>(null);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    area: DELIVERY_AREAS[0].name,
    payment: "pix" as PaymentMethod,
    changeFor: "",
    notes: "",
  });

  const lines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => {
          const p = MENU.find((m) => m.id === id);
          return p && qty > 0 ? { ...p, qty } : null;
        })
        .filter((l): l is NonNullable<typeof l> => l !== null),
    [cart]
  );

  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const fee = DELIVERY_AREAS.find((a) => a.name === form.area)?.fee ?? 0;
  const total = subtotal + fee;
  const count = lines.reduce((s, l) => s + l.qty, 0);

  const change = (id: string, delta: number) =>
    setCart((c) => {
      const next = Math.max(0, (c[id] ?? 0) + delta);
      const { [id]: _removed, ...rest } = c;
      return next === 0 ? rest : { ...rest, [id]: next };
    });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: lines.map((l) => ({ id: l.id, qty: l.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao enviar o pedido");

      const message = buildWhatsAppMessage({
        orderNumber: data.orderNumber,
        customerName: form.customerName,
        phone: form.phone,
        address: form.address,
        area: form.area,
        lines: data.lines,
        subtotal: data.subtotal,
        deliveryFee: data.deliveryFee,
        total: data.total,
        payment: form.payment,
        changeFor: form.changeFor,
        notes: form.notes,
      });
      const link = buildWhatsAppLink(WHATSAPP, message);
      setDone({ link, orderNumber: data.orderNumber, total: data.total, pix: form.payment === "pix" });
      window.open(link, "_blank");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <main className="wrap">
        <section className="card center">
          <h1>Pedido #{done.orderNumber} pronto! 🍕</h1>
          <p>Para confirmar, envie a mensagem no WhatsApp da pizzaria.</p>
          <a className="btn primary" href={done.link} target="_blank" rel="noreferrer">
            Abrir WhatsApp
          </a>
          {done.pix && (
            <div className="pix">
              <p>
                Pague <strong>{brl(done.total)}</strong> via Pix para <strong>{PIX_NAME}</strong>:
              </p>
              <code>{PIX_KEY}</code>
              <button className="btn" onClick={() => navigator.clipboard.writeText(PIX_KEY)}>
                Copiar chave Pix
              </button>
              <p className="muted">Envie o comprovante pelo WhatsApp.</p>
            </div>
          )}
          <button
            className="btn link"
            onClick={() => {
              setDone(null);
              setCart({});
              setCheckout(false);
            }}
          >
            Fazer novo pedido
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="wrap">
      <header className="hero">
        <Link href="/" className="back">Voltar ao início</Link>
        <h1>Pizzaria Choupana</h1>
        <p>Delivery de pizza · Abrimos às 18:00</p>
      </header>

      {!checkout ? (
        <>
          {CATEGORIES.map((cat) => (
            <section key={cat}>
              <h2>{cat}</h2>
              {MENU.filter((p) => p.category === cat).map((p) => (
                <div className="item" key={p.id}>
                  <div>
                    <strong>{p.name}</strong>
                    {p.description && <p className="muted">{p.description}</p>}
                    <span className="price">{brl(p.price)}</span>
                  </div>
                  <div className="qty">
                    <button aria-label={`Remover ${p.name}`} onClick={() => change(p.id, -1)} disabled={!cart[p.id]}>
                      −
                    </button>
                    <span>{cart[p.id] ?? 0}</span>
                    <button aria-label={`Adicionar ${p.name}`} onClick={() => change(p.id, 1)}>
                      +
                    </button>
                  </div>
                </div>
              ))}
            </section>
          ))}

          {count > 0 && (
            <div className="bar">
              <span>
                {count} {count === 1 ? "item" : "itens"} · {brl(subtotal)}
              </span>
              <button className="btn primary" onClick={() => setCheckout(true)}>
                Ver pedido
              </button>
            </div>
          )}
        </>
      ) : (
        <form className="card" onSubmit={submit}>
          <h2>Seu pedido</h2>
          {lines.map((l) => (
            <div className="row" key={l.id}>
              <span>
                {l.qty}x {l.name}
              </span>
              <span>{brl(l.price * l.qty)}</span>
            </div>
          ))}

          <label>
            Nome
            <input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
          </label>
          <label>
            Telefone / WhatsApp
            <input required inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </label>
          <label>
            Endereço (rua, número, complemento)
            <input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </label>
          <label>
            Bairro
            <select value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })}>
              {DELIVERY_AREAS.map((a) => (
                <option key={a.name} value={a.name}>
                  {a.name} — {brl(a.fee)}
                </option>
              ))}
            </select>
          </label>
          <label>
            Pagamento
            <select value={form.payment} onChange={(e) => setForm({ ...form, payment: e.target.value as PaymentMethod })}>
              {(Object.keys(PAYMENT_LABEL) as PaymentMethod[]).map((k) => (
                <option key={k} value={k}>
                  {PAYMENT_LABEL[k]}
                </option>
              ))}
            </select>
          </label>
          {form.payment === "dinheiro" && (
            <label>
              Troco para quanto?
              <input value={form.changeFor} onChange={(e) => setForm({ ...form, changeFor: e.target.value })} placeholder="Ex.: R$ 100" />
            </label>
          )}
          <label>
            Observações
            <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Ex.: meio a meio calabresa/mussarela, sem cebola" />
          </label>

          <div className="row">
            <span>Subtotal</span>
            <span>{brl(subtotal)}</span>
          </div>
          <div className="row">
            <span>Entrega</span>
            <span>{brl(fee)}</span>
          </div>
          <div className="row total">
            <span>Total</span>
            <span>{brl(total)}</span>
          </div>

          {error && <p className="error">{error}</p>}

          <button className="btn primary" type="submit" disabled={sending || count === 0}>
            {sending ? "Enviando..." : "Enviar pedido pelo WhatsApp"}
          </button>
          <button className="btn link" type="button" onClick={() => setCheckout(false)}>
            Voltar ao cardápio
          </button>
        </form>
      )}
    </main>
  );
}
