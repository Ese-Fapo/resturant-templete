import React from 'react';
import Image from 'next/image';


const About = () => {
  return (
    <section className="w-full bg-gradient-to-br from-lime-50 to-green-100 py-16 px-2 md:px-0">
      <div className="max-w-4xl mx-auto rounded-3xl shadow-xl bg-white p-8 md:p-16 border border-lime-100">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-lime-700 drop-shadow mb-4 tracking-tight">About Us</h2>
        <p className="text-center text-lg text-gray-700 mb-8">
          Welcome to Foodie Haven! We are passionate about bringing you the freshest, tastiest dishes crafted with love and care. Our mission is to make every meal memorable, whether you dine in or order online.
        </p>
        <div className="flex flex-col md:flex-row items-center gap-8 mt-8">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-lime-800 mb-2">Our Story</h3>
            <p className="text-gray-600 mb-4">
              Founded in 2020, Foodie Haven started as a small family restaurant and quickly grew into a beloved local spot. We believe in quality ingredients, friendly service, and a cozy atmosphere that feels like home.
            </p>
            <p className="text-gray-600">
              Our chefs are dedicated to creating unique flavors and unforgettable experiences. We value sustainability, community, and the joy of sharing great food.
            </p>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <div className="rounded-full w-58 h-48  bg-lime-200 flex items-center justify-center mb-4 shadow-lg">
                {/* Replace with team image if available */}
                <div className="relative w-full h-full">
                  <Image
                    src="/images/3chefs.avif"
                    alt="Team Member"
                    fill
                    sizes="180px"
                    className="rounded-full object-cover border-4 border-lime-200 shadow-xl"
                  />
                </div>
            </div>
            <h4 className="text-xl font-semibold text-lime-700 mb-2">Meet Our Team</h4>
            <ul className="text-gray-700 text-center">
              <li>Chef Mario Rossi</li>
              <li>Manager Ana Silva</li>
              <li>Barista Lucas Costa</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
