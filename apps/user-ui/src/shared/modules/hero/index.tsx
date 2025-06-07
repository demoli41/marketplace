'use client';
import { MoveRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import Image from 'next/image';

const Hero = () => {
  const router = useRouter();

  return (
    <section className="bg-[#004450] h-[90vh] w-full flex items-center justify-center px-4">
      <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between">
        {/* Left Text Block */}
        <div className="text-white md:w-1/2 space-y-4">
          <p className="text-lg font-medium">Ціни від 400 грн</p>

          <h1 className="text-6xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
            Найкращі годинники <br />
            Колекція 2025
          </h1>

          <p className="text-xl font-Oregano">
            Ексклюзивна пропозиція <span className="text-yellow-400 font-bold">10%</span> цього тижня
          </p>

          <button
            onClick={() => router.push('/products')}
            className="mt-4 w-fit px-6 py-2 border border-white text-white hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2 rounded-lg"
          >
            Переглянути товари <MoveRight size={18} />
          </button>
        </div>

        {/* Image Block */}
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <Image
            src="https://ik.imagekit.io/q6fjhegkp/products/Hero.png?updatedAt=1749295161044"
            alt="Hero Watch"
            width={500}
            height={500}
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
