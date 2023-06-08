import Product from "../model/Product/page";
import { NextResponse } from "next/server";
import { storage } from "../../firebase";
import { deleteObject, ref } from "firebase/storage";

const fetchSingle = async ({ productId }) => {
  try {
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/SingleProduct?productId=${productId}`
    ).then((res) => res.json());

    return result.product;
  } catch (error) {
    console.log(error);
  }
};

export async function POST(request) {
  const { productId } = await request.json();
  const pro = await fetchSingle({ productId });

  let promises = [];

  for (var i = 0; i < pro.images.length; i++) {
    promises.push(
      new Promise(async (resolve, reject) => {
        try {
          const desertRef = ref(storage, pro.images[i]);

          deleteObject(desertRef)
            .then(() => {
              resolve(desertRef);
              console.log(desertRef);
            })
            .catch((error) => {
              reject();
              console.log(error);
            });
        } catch (error) {
          reject(error);
        }
      })
    );
  }

  await Promise.all(promises).then(async () => {
    await Product.findOneAndDelete({ _id: pro._id });
  });
  return NextResponse.json({ text: "OK" });
}
