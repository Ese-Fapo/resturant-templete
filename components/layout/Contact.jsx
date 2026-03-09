
import React from 'react';


const Contact = () => {
	return (
		<section id="contact" className="max-w-2xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl p-5 sm:p-8 md:p-12 mt-8 sm:mt-12 border border-lime-100">
			<h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-emerald-700 mb-2 sm:mb-4">Contato</h2>
			<p className="text-center text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed">
				Entre em contato conosco! Estamos localizados em São Paulo, Brasil.
			</p>
			<div className="mb-6 sm:mb-8 text-center space-y-2 sm:space-y-3">
				<p className="text-sm sm:text-base text-gray-700"><span className="font-semibold">Endereço:</span> Av. Paulista, 1000, Bela Vista, São Paulo - SP, 01310-100</p>
				<p className="text-sm sm:text-base text-gray-700"><span className="font-semibold">Telefone:</span> (11) 1234-5678</p>
				<p className="text-sm sm:text-base text-gray-700"><span className="font-semibold">Email:</span> contato@nossapizza.com.br</p>
			</div>
			<form className="flex flex-col gap-3 sm:gap-4">
				<input
					type="text"
					placeholder="Seu nome"
					className="border border-gray-300 rounded-lg px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all"
				/>
				<input
					type="email"
					placeholder="Seu email"
					className="border border-gray-300 rounded-lg px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all"
				/>
				<textarea
					placeholder="Sua mensagem"
					rows={5}
					className="border border-gray-300 rounded-lg px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all resize-none"
				/>
				<button
					type="submit"
					className="bg-emerald-500 text-white font-semibold rounded-lg px-6 py-2.5 sm:py-3 mt-2 sm:mt-4 text-sm sm:text-base hover:bg-emerald-600 transition-all duration-200 hover:shadow-lg"
				>
					Enviar mensagem
				</button>
			</form>
		</section>
	);
};

export default Contact;



