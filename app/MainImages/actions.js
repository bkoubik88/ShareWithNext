"use server";

export async function FetchProducts(page) {
  const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/Products`, {
    method: "POST",
    headers: { "Content-Typ": "application/json" },
    body: JSON.stringify({ page: page }),
    cache: "no-store",
  });

  const expected = await result.json();

  return expected;
}

export async function FilterProducts(filter) {
  const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/FilterProducts`, {
    method: "POST",
    headers: {
      "Content-Typ": "application/json",
    },
    body: JSON.stringify({ filter: filter }),
  });

  const expected = await result.json();

  return expected;
}
