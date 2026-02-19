import React from 'react'
import Link from 'next/link'

const Header = () => {
  return (
    <div>
       <header className='flex items-center justify-between py-4'>
      <Link className='text-emerald-600 font-semibold text-3xl'  href="#">
      Nossa Pizza
      </Link>
      <nav className=' flex items-center space-x-4 gap-8 text-gray-500 font-semibold'> 
      <Link href="#">Inicio</Link>
      <Link href="#">Nosso menu</Link>
      <Link href="#">Sobre nós</Link>
      <Link href="#">Contato</Link>
      <Link href="#" className='rounded-full bg-red-600 text-white px-8 py-2'>Login</Link>
      </nav>
    </header>
    </div>
  )
}

export default Header
