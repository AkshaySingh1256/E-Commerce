import React from 'react';
import Link from 'next/link';
import { ownUrl } from '../utils/image';
import { FiShoppingCart } from 'react-icons/fi';
const HeroBanner = ({ heroBanner }) => {
  //console.log(heroBanner);
  return (
    <div className="rounded-2xl bg-gray-900/75 py-4 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 text-white">
    <div className="flex flex-col md:flex-row items-center">
      <div className="md:w-1/2">
        <p className="text-sm text-gray-400">{heroBanner.smallText}</p>
        <h3 className="text-2xl md:text-3xl lg:text-4xl text-gray-300 font-semibold mt-2 md:mt-4">{heroBanner.midText}</h3>
        <p className="text-4xl md:text-5xl lg:text-6xl text-gray-100 mt-2 md:mt-4">{heroBanner.largeText1}</p>
  
        <div className="mt-4">
          <Link href={`/product/${heroBanner.slug.current}`} passHref>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300" type="button">
            <FiShoppingCart className="inline-block mr-2" /> {heroBanner.buttonText}
            </button>
          </Link>
        </div>
      </div>
  
      <div className="md:w-1/2 mt-4 md:mt-0">
        <img src={ownUrl(heroBanner.image)} alt="headphones" className="w-full" />
      </div>
    </div>
  
    <div >
      <h5 className="text-xl md:text-2xl lg:text-3xl text-gray-300 font-semibold">Description</h5>
      <p className="text-gray-400 mt-2">{heroBanner.description}</p>
    </div>
  </div>
  

  
  )
}

export default HeroBanner;
