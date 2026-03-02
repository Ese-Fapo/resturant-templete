import React from 'react';
import Image from 'next/image';


const About = () => {
  return (
    <section className="w-full bg-linear-to-br from-lime-50 to-green-100 py-16 px-2 md:px-0">
      <div className="max-w-4xl mx-auto rounded-3xl shadow-xl bg-white p-8 md:p-16 border border-lime-100">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-lime-700 drop-shadow mb-4 tracking-tight">Sobre Nós</h2>
        <p className="text-center text-lg text-gray-700 mb-8">
          Bem-vindo à Nossa Pizza! Somos apaixonados por servir pratos frescos e saborosos, preparados com muito carinho. Nosso objetivo é tornar cada refeição memorável, seja no salão ou no delivery.
        </p>
        <div className="flex flex-col md:flex-row items-center gap-8 mt-8">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-lime-800 mb-2">Nossa História</h3>
            <p className="text-gray-600 mb-4">
              Fundada em 2020, a Nossa Pizza começou como um restaurante familiar e logo virou ponto querido do bairro. Acreditamos em ingredientes de qualidade, atendimento acolhedor e um ambiente que lembra casa.
            </p>
            <p className="text-gray-600">
              Nossos chefs criam sabores únicos e experiências inesquecíveis. Valorizamos sustentabilidade, comunidade e a alegria de compartilhar boa comida.
            </p>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <div className="rounded-full w-58 h-48  bg-lime-200 flex items-center justify-center mb-4 shadow-lg">
                {/* Replace with team image if available */}
                <div className="relative w-full h-full">
                  <Image
                    src="/images/3chefs.avif"
                    alt="Equipe de chefs"
                    fill
                    sizes="180px"
                    className="rounded-full object-cover border-4 border-lime-200 shadow-xl"
                  />
                </div>
            </div>
            <h4 className="text-xl font-semibold text-lime-700 mb-2">Conheça a Equipe</h4>
            <ul className="text-gray-700 text-center">
              <li>Chef Mário Rossi</li>
              <li>Gerente Ana Silva</li>
              <li>Barista Lucas Costa</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
