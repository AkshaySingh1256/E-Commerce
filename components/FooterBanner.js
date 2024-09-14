import React from 'react';
import Link from 'next/link';
import { FiShoppingCart } from 'react-icons/fi';
import { ownUrl } from '../utils/image';

const FooterBanner = ({ footerBanner: { discount, largeText1, largeText2, saleTime, smallText, midText, description, slug, buttonText, image } }) => {
  console.log(slug);
  return (
    <div className="bg-gray-600 rounded-lg p-2 shadow-lg">
  <div className="sm:flex sm:justify-center">
  <div className="sm:w-1/2">
      <div className="relative">
        <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 transform -translate-x-2/4 translate-y-2/4 rotate-45">
          {discount}% OFF
        </div>
        <img src={ownUrl(image)} className="w-full md:w-3/4 lg:w-3/4 rounded-lg" alt="Product Image" />
      </div>
    </div>
    <div className="sm:w-1/2 mt-4 sm:mt-0 sm:ml-4">
      <h3 className="text-2xl font-bold text-white">{largeText1}</h3>
      <h3 className="text-2xl font-bold text-white mt-2">{largeText2}</h3>
      <p className="text-white mt-2">{saleTime}</p>
      <p className="text-white mt-4">{smallText}</p>
      <h3 className="text-xl font-semibold text-white mt-2">{midText}</h3>
      <p className="text-white mt-2">{description}</p>
      <Link href={`/product/${slug.current}`} passHref>
        
        <button className="bg-blue-500 mt-10 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300" type="button">
            <FiShoppingCart className="inline-block mr-2" /> {buttonText}
            </button>
      </Link>
    </div>
  </div>
</div>

  

  )
}

export default FooterBanner