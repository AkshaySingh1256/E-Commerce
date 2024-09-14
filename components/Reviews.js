import React, { useState, useEffect } from 'react';
import SwiperCore, { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css'; 

SwiperCore.use([Pagination]);

const Reviews = ({ reviews }) => {
  const [expandedReview, setExpandedReview] = useState(null);
  const [slidesPerView, setSlidesPerView] = useState(2); // Default value for desktop

  const toggleExpanded = (index) => {
    if (expandedReview === index) {
      setExpandedReview(null);
    } else {
      setExpandedReview(index);
    }
  };

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
    <div className="p-4 " >
      <h2 className="text-2xl font-semibold mb-4">Product Reviews</h2>
      <Swiper slidesPerView={slidesPerView} spaceBetween={10} pagination={{ clickable: true }} style={{zIndex:'0'}}>
        {reviews.map((review, index) => (
          <SwiperSlide key={index}>
            <div
              className={`p-4 mb-4 rounded-lg bg-black/40 shadow-md ${
                expandedReview === index ? 'h-auto' : 'h-36 overflow-hidden'
              }`}
            >
              <p className="text-white font-semibold">{review.userName}</p>
              <p className={`text-white/80 mt-2 ${expandedReview === index ? '' : 'truncate'}`}>
                {review.comment}
              </p>
              {review.comment.length > 50 && (
                <button
                  className="text-blue-500 hover:underline mt-2"
                  onClick={() => toggleExpanded(index)}
                >
                  {expandedReview === index ? 'Read Less' : 'Read More'}
                </button>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Reviews;
