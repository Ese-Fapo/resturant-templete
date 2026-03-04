
// Hero section for landing page: displays main headline, description, CTA buttons, and hero image
import Image from "next/image";
import Link from "next/link";
import { FaPizzaSlice } from "react-icons/fa6";
import { FaBellConcierge } from "react-icons/fa6";



export default function Hero() {
  return (
    <section className="relative grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center bg-linear-to-br from-lime-50 to-emerald-100 rounded-2xl sm:rounded-3xl shadow-xl py-12 sm:py-16 lg:py-20 px-4 sm:px-8 md:px-12 my-6 sm:my-8 overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-200 opacity-30 rounded-full blur-2xl z-0" />
      <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-lime-200 opacity-20 rounded-full blur-2xl z-0" />

      {/* Left column: headline, description, and call-to-action buttons */}
      <div className="flex flex-col justify-center items-start gap-4 sm:gap-6 py-6 sm:py-8 z-10 px-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-emerald-700 drop-shadow mb-2">
          Tudo fica <br />
          melhor com <span className="text-emerald-500">Pizza</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-4 sm:mb-6 max-w-md leading-relaxed">
          Descubra a melhor pizza da cidade, feita com ingredientes frescos e muito carinho. Confira nosso cardápio.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
          {/* CTA: Go to menu button */}
          <Link href="/menu" className="px-5 sm:px-6 py-2.5 sm:py-3 bg-emerald-500 text-white rounded-full font-semibold text-sm sm:text-base shadow-lg hover:bg-emerald-600 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
            Ver cardápio <FaPizzaSlice />
          </Link>
          {/* CTA: Order now button */}
          <Link href="/menu" className="px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-emerald-600 border border-emerald-400 rounded-full font-semibold text-sm sm:text-base shadow hover:bg-emerald-50 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
            Peça agora <FaBellConcierge />
          </Link>
        </div>
      </div>

      {/* Right column: hero image (pizza in oven) */}
      <div className="relative w-full aspect-square max-w-xs sm:max-w-sm md:max-w-md mx-auto z-10 group mt-4 sm:mt-0">
        <Image
          src="/images/pizza_5.png"
          alt="Pizza saindo do forno"
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-contain rounded-3xl shadow-2xl group-hover:scale-105 group-hover:rotate-2 transition-all duration-300"
          priority
        />
      </div>
    </section>
  );
}
