import React from 'react';
import Image from 'next/image';


const About = () => {
  return (
    <section id="about" className="w-full bg-linear-to-br from-lime-50 via-emerald-50 to-green-100 py-12 sm:py-16 lg:py-20 px-3 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-lime-700 drop-shadow-sm mb-3 sm:mb-4 tracking-tight leading-tight">
            Sobre Nós
          </h2>
          <div className="w-20 h-1 bg-linear-to-r from-emerald-400 to-lime-500 mx-auto rounded-full mb-4 sm:mb-6"></div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
            Bem-vindo à <span className="font-semibold text-lime-700">Nossa Pizza</span>! Somos apaixonados por servir pratos frescos e saborosos, preparados com muito carinho. Nosso objetivo é tornar cada refeição memorável, seja no salão ou no delivery.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-lime-100/50 hover:shadow-emerald-200/50 transition-shadow duration-500">
          <div className="flex flex-col lg:flex-row">
            {/* Story Section */}
            <div className="flex-1 p-6 sm:p-8 lg:p-10 space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-lime-400 to-emerald-500 flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-lime-800">Nossa História</h3>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                  Fundada em 2020, a <span className="font-semibold text-lime-700">Nossa Pizza</span> começou como um restaurante familiar e logo virou ponto querido do bairro. Acreditamos em ingredientes de qualidade, atendimento acolhedor e um ambiente que lembra casa.
                </p>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                  Nossos chefs criam sabores únicos e experiências inesquecíveis. Valorizamos sustentabilidade, comunidade e a alegria de compartilhar boa comida.
                </p>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-lime-100">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-600">5+</div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-1">Anos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-lime-600">1000+</div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-1">Clientes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-600">50+</div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-1">Pratos</div>
                </div>
              </div>
            </div>

            {/* Team Section */}
            <div className="flex-1 bg-linear-to-br from-lime-50 to-emerald-50 p-6 sm:p-8 lg:p-10 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-lime-100">
              <div className="relative group mb-6 sm:mb-8">
                {/* Decorative background circle */}
                <div className="absolute inset-0 rounded-full bg-linear-to-br from-emerald-200 to-lime-200 blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                
                {/* Image container */}
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden shadow-2xl border-4 border-white group-hover:border-lime-300 transition-all duration-500 group-hover:scale-105 transform">
                  <Image
                    src="/images/3chefs.avif"
                    alt="Equipe de chefs"
                    fill
                    sizes="(max-width: 640px) 160px, (max-width: 1024px) 192px, 224px"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              <div className="text-center w-full">
                <h4 className="text-xl sm:text-2xl font-bold text-lime-700 mb-3 sm:mb-4 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Conheça a Equipe
                </h4>
                
                <div className="space-y-2 sm:space-y-3">
                  <div className="bg-white rounded-xl px-4 sm:px-6 py-3 shadow-md hover:shadow-lg transition-shadow duration-300 border border-lime-100">
                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                      <span className="text-2xl">👨‍🍳</span>
                      <div className="text-left">
                        <p className="font-semibold text-sm sm:text-base text-gray-800">Chef Mário Rossi</p>
                        <p className="text-xs text-gray-500">Chef Executivo</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl px-4 sm:px-6 py-3 shadow-md hover:shadow-lg transition-shadow duration-300 border border-lime-100">
                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                      <span className="text-2xl">👩‍💼</span>
                      <div className="text-left">
                        <p className="font-semibold text-sm sm:text-base text-gray-800">Gerente Ana Silva</p>
                        <p className="text-xs text-gray-500">Gerente Geral</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl px-4 sm:px-6 py-3 shadow-md hover:shadow-lg transition-shadow duration-300 border border-lime-100">
                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                      <span className="text-2xl">☕</span>
                      <div className="text-left">
                        <p className="font-semibold text-sm sm:text-base text-gray-800">Barista Lucas Costa</p>
                        <p className="text-xs text-gray-500">Especialista em Café</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom decorative element */}
        <div className="text-center mt-8 sm:mt-12">
          <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white rounded-full shadow-lg border border-lime-100">
            <span className="text-xl sm:text-2xl">🍕</span>
            <span className="text-xs sm:text-sm font-semibold text-lime-700">Feito com amor desde 2020</span>
            <span className="text-xl sm:text-2xl">❤️</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
