"use server";

export async function LoadComments() {
  const comments = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/GetComments`
  ).then((res) => {
    res.json();
  });

  return comments;
}
