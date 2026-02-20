
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const HomeMenu = () => {
  return (
   <section className="w-full bg-gradient-to-br from-lime-50 to-green-100 py-16 px-2 md:px-0">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-lime-700 drop-shadow mb-4 tracking-tight">Our Menu</h2>
        <p className="text-center text-lg text-gray-700 mb-12">Explore our delicious menu items</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {/* Example menu items */}
          <div className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col items-center border border-lime-100 hover:border-lime-400">
            <div className="overflow-hidden rounded-2xl w-full mb-4">
              <Image src="/images/pizza_in.jpeg" alt="Pizza Margherita" width={400} height={300} className="rounded-2xl group-hover:scale-105 transition-transform duration-300" />
            </div>
            <h3 className="text-2xl font-bold text-lime-800 mb-2">Pizza Margherita</h3>
            <p className="text-gray-600 mb-4 text-center">Classic pizza with tomato sauce, mozzarella, and basil.</p>
            <Link href="#" className="rounded-full bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-700 text-white px-8 py-2 font-semibold shadow-lg transition-all duration-200 mt-auto">Order Now <span className="font-bold">R$14.99</span></Link>
          </div>

          <div className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col items-center border border-lime-100 hover:border-lime-400">
            <div className="overflow-hidden rounded-2xl w-full mb-4">
              <Image src="/images/pizza-1.jpeg" alt="Spaghetti Carbonara" width={400} height={300} className="rounded-2xl group-hover:scale-105 transition-transform duration-300" />
            </div>
            <h3 className="text-2xl font-bold text-lime-800 mb-2">Spaghetti Carbonara</h3>
            <p className="text-gray-600 mb-4 text-center">Traditional Italian pasta with eggs, cheese, pancetta, and pepper.</p>
            <Link href="#" className="rounded-full bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-700 text-white px-8 py-2 font-semibold shadow-lg transition-all duration-200 mt-auto">Order Now <span className="font-bold">R$26</span></Link>
          </div>

          <div className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col items-center border border-lime-100 hover:border-lime-400">
            <div className="overflow-hidden rounded-2xl w-full mb-4">
              <Image src="/images/pizzaria-1920.webp" alt="Caesar Salad" width={400} height={300} className="rounded-2xl group-hover:scale-105 transition-transform duration-300" />
            </div>
            <h3 className="text-2xl font-bold text-lime-800 mb-2">Caesar Salad</h3>
            <p className="text-gray-600 mb-4 text-center">Crisp romaine lettuce with Caesar dressing, croutons, and Parmesan.</p>
            <Link href="#" className="rounded-full bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-700 text-white px-8 py-2 font-semibold shadow-lg transition-all duration-200 mt-auto">Order Now <span className="font-bold">R$9.99</span></Link>
          </div>
        </div>
      </div>
   </section>
  )
}

export default HomeMenu
