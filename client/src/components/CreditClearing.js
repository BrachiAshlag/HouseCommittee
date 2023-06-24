const paypal = require('paypal-rest-sdk');


export default function CreditCardClearing(params) {
  paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': '<your_client_id>',
    'client_secret': '<your_client_secret>'
  });
  
  const payment = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "redirect_urls": {
        "return_url": "http://localhost:3000/creditSuccess",
        "cancel_url": "http://localhost:3000/creditCancel"
      },
      "transactions": [{
        "item_list": {
          "items": [{
            "name": "item",
            "sku": "item",
            "price": "1.00",
            "currency": "USD",
            "quantity": 1
          }]
        },
        "amount": {
          "currency": "USD",
          "total": "1.00"
        },
        "description": "This is a test payment."
      }]
    };
    
    paypal.payment.create(payment, function (error, payment) {
      if (error) {
        console.log(error);
      } else {
        console.log(payment);
      }
    });
}