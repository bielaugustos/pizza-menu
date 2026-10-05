// PLACEHOLDER MENU: replace names, descriptions and prices with the shop's real ones.
export type Product = {
  id: string;
  category: string;
  name: string;
  description?: string;
  price: number; // in BRL
};

export const CATEGORIES = ["Pizzas", "Bebidas"] as const;

export const MENU: Product[] = [
  { id: "p-calabresa", category: "Pizzas", name: "Calabresa", description: "Mussarela, calabresa, cebola e azeitonas", price: 45 },
  { id: "p-mussarela", category: "Pizzas", name: "Mussarela", description: "Mussarela, tomate, orégano e azeitonas", price: 42 },
  { id: "p-portuguesa", category: "Pizzas", name: "Portuguesa", description: "Mussarela, presunto, ovo, cebola e azeitonas", price: 48 },
  { id: "p-metade", category: "Pizzas", name: "Meio a meio", description: "Escolha dois sabores (informe nas observações)", price: 46 },
  { id: "b-refri2l", category: "Bebidas", name: "Refrigerante 2L", price: 12 },
  { id: "b-lata", category: "Bebidas", name: "Refrigerante lata", price: 6 },
];

// PLACEHOLDER delivery fees by neighborhood.
export const DELIVERY_AREAS: { name: string; fee: number }[] = [
  { name: "Centro", fee: 5 },
  { name: "Bairro vizinho 1", fee: 7 },
  { name: "Bairro vizinho 2", fee: 10 },
];

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
