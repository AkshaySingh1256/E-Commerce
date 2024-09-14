export default {
  name: 'banner',
  title: 'Banner',
  type: 'document',
  fields: [
      {
          name: 'image',
          title: 'Image',
          type: 'image',
          options: {
              hotspot: true,
          },
      },
      {
        name: 'name',
        title: 'Name',
        type: 'string',
      },
      {
          name: 'buttonText',
          title: 'ButtonText',
          type: 'string',
      },
      {
          name: 'product',
          title: 'Product',
          type: 'string',
      },
      {
        name: 'description',
        title: 'Description',
        type: 'string',
      },
      {
        name: 'price',
        title: 'Price',
        type: 'number',
      },
      {
          name: 'smallText',
          title: 'SmallText',
          type: 'string',
      },
      {
          name: 'midText',
          title: 'MidText',
          type: 'string',
      },
      {
          name: 'largeText1',
          title: 'LargeText1',
          type: 'string',
      },
      {
          name: 'largeText2',
          title: 'LargeText2',
          type: 'string',
      },
      {
          name: 'discount',
          title: 'Discount',
          type: 'string',
      },
      {
          name: 'saleTime',
          title: 'SaleTime',
          type: 'string',
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: {
          source: 'name',
          maxLength: 96,
        },
      },
      {
        name: 'brand',
        title: 'Brand',
        type: 'string',
      },
      {
        name: 'category',
        title: 'Category',
        type: 'string',
      },
      {
        name: 'rating',
        title: 'Rating',
        type: 'number',
      },
  
      {
        name: 'numReviews',
        title: 'NumReviews',
        type: 'number',
      },
      {
        name: 'countInStock',
        title: 'CountInStock',
        type: 'number',
      },
  ],
};
