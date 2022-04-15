const express = require("express");
const cors = require("cors");
// import Stripe from 'stripe';
const Stripe = require('strip');

const app = express();

app.use(express.json());
app.use(cors());

const port = 5000;

app.get("/", (req, res) => {
  res.send("server is running");
});

app.get(
  '/stripe-key',
  (req, res) => {
    // const { publishable_key } = getKeys(req.query.paymentMethod);
    const publishable_key = 'pk_test_51KeXrmExsbXRovz7Ve5VBK7RLrMst5UZYDmL5izxHiaczqqUrGhGmhz8wwijvUxjJR8SOa6e9LIxIPSai3QhaWh100YSdfWuFb';

    return res.send({ publishableKey: publishable_key });
  }
);

app.post('/payment-sheet', async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  const customer = await Stripe.customers.create();
  const ephemeralKey = await Stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2020-08-27'}
  );
  const paymentIntent = await Stripe.paymentIntents.create({
    amount: 1099,
    currency: 'eur',
    customer: customer.id,
    payment_method_types: ['card'],
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: 'pk_test_51KeXrmExsbXRovz7Ve5VBK7RLrMst5UZYDmL5izxHiaczqqUrGhGmhz8wwijvUxjJR8SOa6e9LIxIPSai3QhaWh100YSdfWuFb'
  });
});

// const test = async () => {
//   const customer = await Stripe.customers.create();
//   const paymentIntent = await Stripe.paymentIntents.create({
//     amount: 1099,
//     currency: 'eur',
//     customer: customer.id,
//     payment_method_types: ['card'],
//   });
//   return paymentIntent;
// }

// console.log(test());

app.listen(process.env.PORT || port);