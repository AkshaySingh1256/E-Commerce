import React,{useEffect,useState} from "react";
import ProductItem from "./ProductItem";
import Link from "next/link";
import { Grid } from '@mui/material';
import { MdReadMore} from 'react-icons/md';
import SwiperCore, { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

SwiperCore.use([Pagination]);
const SwiperProduct = ({ addToCartHandler, products, brand }) => {
  const [slidesPerView, setSlidesPerView] = useState(2); // Default value for desktop
  useEffect(() => {
    const handleResize = () => {
      // Check the screen width and set slidesPerView accordingly
      if (window.innerWidth <= 768) {
        // Mobile view
        setSlidesPerView(1);
      } else {
        // Laptop/Desktop view
        setSlidesPerView(4);
      }
    };

    // Initial check on component mount
    handleResize();

    // Listen for window resize events
    window.addEventListener('resize', handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <>
      <div>
        <div className="flex flex-row my-5  p-2 justify-between items-center">
          <div className="flex-grow">
            <p className="text-lg font-bold">Best of {brand}</p>
          </div>
          <div>
            
              <Link  href={`/search?brand=${brand}`}><div className="text-sm text-gray-500 cursor-pointer">View All <MdReadMore size={25} className="inline-block ml-2" /> </div></Link>
           
          </div>
        </div>
        
        <Swiper slidesPerView={slidesPerView} spaceBetween={10} pagination={{ clickable: true }}>
        
          
        {products
            .filter((product) => product.brand === brand).slice(0, 8)
            .map((product,index) => (
              <SwiperSlide key={index}>
              <Grid item  key={product.slug}>
                <ProductItem
                  product={product}
                  addToCartHandler={addToCartHandler}
                ></ProductItem>
              </Grid>
              </SwiperSlide>
            ))}
        
        </Swiper>
      </div>
    </>
  )
}

export default SwiperProduct;
