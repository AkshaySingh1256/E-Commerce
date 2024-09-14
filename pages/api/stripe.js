import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log("order product",req.body.hi.orderItems);
    //const hello req.body;
    try {
        //currency: 'usd',
        const line_items = req.body.hi.orderItems.map((item) => {
            return {
              
              price_data: {
                currency: 'inr',
                product_data: {
                  name: item.name,
                  images: [item.image], // Array of image URLs
                },
                unit_amount: item.price * 100, // Convert price to smallest currency unit (e.g., cents)
              },
              quantity: item.quantity,
              
              
              
            };
          });
      const params = {
        
        submit_type: 'pay',
        mode: 'payment',
        payment_method_types:['card'],
        billing_address_collection: 'required',
        shipping_options: [
          { shipping_rate: 'shr_1NjimzSAgXWmlJaTVvk6u7E9' },
          { shipping_rate: 'shr_1NjioUSAgXWmlJaTzBfgI6Wm' },
        ],
        line_items,
        payment_intent_data: {
          metadata: {
            orderId: req.body.hi._id,
          },
        },
        customer_email:req.body.email,
        invoice_creation:{
          enabled:true,
          invoice_data:{
            
          }
        },
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/order/${req.body.hi._id}`,
     
    }

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);

      res.status(200).json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
/*shipping: {
            address: {
              city: req.body.shippingAddress.city,
              country: req.body.shippingAddress.country,
              line1: req.body.shippingAddress.address,
              postal_code: req.body.shippingAddress.postalCode,
            },
            name: req.body.shippingAddress.fullName,
          },
              adjustable_quantity:{
            enabled:true,
            minmum:1
        },
        amount_subtotal:req.body.itemsPrice,
        customer_details: {
          email:null,
          name: req.body.shippingAddress.fullName,
          phone: null,
          address: {
            line1: req.body.shippingAddress.address,
            city: req.body.shippingAddress.city,
            state: null,
            postal_code: req.body.shippingAddress.postalCode,
            country: req.body.shippingAddress.country,
          }
        },
        amount_total:req.body.totalPrice,
        shipping_address_collection:['IN'],*/