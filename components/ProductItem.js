import React from 'react';
import { FiShoppingCart} from 'react-icons/fi';

import NextLink from 'next/link';
import { urlForThumbnail } from '../utils/image';
import {
  CardContent,
  Rating,
  Typography,
} from '@mui/material';
export default function ProductItem({ product, addToCartHandler }) {
  const off = 100 - ((product.price / product.pre_price) * 100);
  console.log("current", product.slug.current);

  return (
    <div className="bg-gray-700/80 z-0 hover:bg-gray-900/80 rounded-lg shadow-md p-4">
      <NextLink href={`/product/${product.slug.current}`} passHref>
        <a>
          {product.branding && (
            <p className="bg-black/80 p-1 text-xs mt-2 text-white rounded-br-2xl rounded-tr-2xl w-1/2">
              {product.branding}
            </p>
          )}
          <img
            src={urlForThumbnail(product.image && product.image[0])}
            alt={product.name}
            className="w-full rounded-lg"
          />
          <p className="text-lg text-white font-semibold mt-2">{product.name}</p>
        </a>
      </NextLink>
      <div className="flex flex-col mt-2">
      <Rating value={product.rating} readOnly></Rating>
        <p className="text-white">
          Rs.{product.price}
          {product.pre_price && (
            <>
              <span className="line-through ml-2 text-white">
                Rs.{product.pre_price}
              </span>
              <span className="text-green-300 ml-2">
                {off.toFixed(2)}% off
              </span>
            </>
          )}
        </p>
        {product.feature && (
          <p className="bg-black/75 px-5 py-1 text-center text-white rounded-3xl mb-2 w-full">
            {product.feature}
          </p>
        )}
         
        <button
          className="bg-blue-500 text-white hover:bg-blue-600 py-2 rounded-lg mt-2"
          onClick={() => addToCartHandler(product)}
        >
          <FiShoppingCart className="inline-block mr-2" /> Add to cart
        </button>
      </div>
    </div>
  );
}
