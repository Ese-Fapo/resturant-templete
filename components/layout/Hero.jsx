
// Hero section for landing page: displays main headline, description, CTA buttons, and hero image
import Image from "next/image";
import Link from "next/link";
import { FaPizzaSlice } from "react-icons/fa6";
import { FaBellConcierge } from "react-icons/fa6";


export default function Hero() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center ">
      {/* Left column: headline, description, and call-to-action buttons */}
      <div className="flex flex-col justify-center items-start gap-4 py-12 px-2">
        <h1 className="text-4xl font-semibold">
          Everything is better with pizza
        </h1>
        <p className="my-4 text-lg text-gray-600">
          Discover the best pizza in town, made with fresh ingredients and love. To experience it, visit our menu.
        </p>
        <div className="flex gap-4">
          {/* CTA: Go to menu button */}
          <Link href="/menu" className="px-4 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition">
            Go to menu <FaPizzaSlice className="inline-block ml-2" />
          </Link>
          {/* CTA: Order now button */}
          <Link href="/menu" className="px-4 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition">
            Order now <FaBellConcierge className="inline-block ml-2" />
          </Link>
        </div>
      </div>

      {/* Right column: hero image (pizza in oven) */}
      <div className="relative w-full aspect-square max-w-md mx-auto">
        <Image
          src="/images/pizza_in oven.jpeg"
          alt="Hero-Image"
          layout="fill"
          objectFit="contain"
        />
      </div>
    </section>
  );
}
