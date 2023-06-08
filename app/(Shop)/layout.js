import Link from "next/link";

export default async function RootLayout({ children }) {
  return (
    <>
      <main className="flex lg:divide-x-2 lg:space-x-4 lg:p-5  dark:bg-gray-900 dark:text-white ">
        <aside class="self-start sticky top-0 col-span-1">
          <div className="hidden lg:block py-32 ">
            <div>
              <div className="mb-5">
                <div>
                  <h1 className="text-red-400">Navigation</h1>
                </div>
              </div>
              <div className="hover:text-blue-200">
                <Link href="New" shallow={true}>
                  New
                </Link>
              </div>
              <div className="hover:text-blue-200">
                <Link href="AllProducts" shallow={true}>
                  All Products
                </Link>
              </div>
              <div className="hover:text-blue-200">
                <Link href="Shirts" shallow={true}>
                  Shirts
                </Link>
              </div>
              <div className="hover:text-blue-200">
                <Link href="Jeans" shallow={true}>
                  Jeans
                </Link>
              </div>
              <div className="hover:text-blue-200">
                <Link href="Sweatshirt" shallow={true}>
                  Sweater
                </Link>
              </div>
            </div>
          </div>
        </aside>
        <div className="lg:flex-1 lg:pl-5 w-full py-32">
          <div>{children}</div>
        </div>
      </main>
    </>
  );
}
