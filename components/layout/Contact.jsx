
import React from 'react';


const Contact = () => {
	return (
		<section className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12 mt-12 border border-lime-100">
			<h2 className="text-3xl md:text-4xl font-extrabold text-center text-emerald-700 mb-4">Contato</h2>
			<p className="text-center text-lg text-gray-700 mb-8">
				Entre em contato conosco! Estamos localizados em São Paulo, Brasil.
			</p>
			<div className="mb-8 text-center">
				<p className="text-gray-700"><span className="font-semibold">Endereço:</span> Av. Paulista, 1000, Bela Vista, São Paulo - SP, 01310-100</p>
				<p className="text-gray-700"><span className="font-semibold">Telefone:</span> (11) 1234-5678</p>
				<p className="text-gray-700"><span className="font-semibold">Email:</span> contato@nossapizza.com.br</p>
			</div>
			<form className="flex flex-col gap-4">
				<input
					type="text"
					placeholder="Seu nome"
					className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
				/>
				<input
					type="email"
					placeholder="Seu email"
					className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
				/>
				<textarea
					placeholder="Sua mensagem"
					rows={4}
					className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
				/>
				<button
					type="submit"
					className="bg-emerald-500 text-white font-semibold rounded-lg px-6 py-2 mt-2 hover:bg-emerald-600 transition"
				>
					Enviar mensagem
				</button>
			</form>
		</section>
	);
};

export default Contact;



