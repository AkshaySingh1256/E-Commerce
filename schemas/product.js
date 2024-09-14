export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'feature',
      title: 'Feature',
      type: 'string',
    },
    {
      name: 'branding',
      title: 'Branding',
      type: 'string',
    },
    {
      name: 'section',
      title: 'Section',
      type: 'string',
    },
    {
      name: 'specification',
      title: 'Specification',
      type: 'string',
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
    },
    {
      name: 'pre_price',
      title: 'Pre_Price',
      type: 'number',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'array',
      of: [{ type: 'image' }],
      options: {
        hotspot: true,
      }
    },
    {
      name: 'description',
      title: 'Description',
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
    {
      name: 'reviews',
      title: 'Reviews',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'userName',
              title: 'User Name',
              type: 'string',
            },
            {
              name: 'comment',
              title: 'Comment',
              type: 'text',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.unique(),
    },
    {
      name: 'buyer',
      title: 'Buyer',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'userName',
              title: 'User Name',
              type: 'string',
            },
            {
              name: 'id',
              title: 'User id',
              type: 'string',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.unique(),
      
    },
  ],
};
