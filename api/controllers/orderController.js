// import OrderModel from "../../models/orderModel.js";
// import userModel from "../../models/userModel.js";
import Stripe from 'stripe';
import userModel from '../models/userModel.js';
import OrderModel from '../models/orderModel.js';

const currency = 'usd';
const deliveryCharge = 50;

const stripe = new Stripe(process.env.STRIPPE_SECRET_KEY);

export const placeOrder = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    let totalAmount = 0;

    
    items.forEach((item) => {
      totalAmount += item.price * item.quantity; 
    });

   
    totalAmount += deliveryCharge;

    const orderData = {
      userId,
      items,
      address,
      amount: totalAmount, 
      paymentMethod: "COD",
      payment: false,
      date: new Date().toISOString(),
    };

   
    const newOrder = new OrderModel(orderData);
    await newOrder.save();

   
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    
    res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.error('Error in placing order:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    const { origin } = req.headers;

    let totalAmount = 0;
    items.forEach((item) => {
      totalAmount += item.price * item.quantity;
    });
    totalAmount += deliveryCharge;

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: { name: 'Delivery Charges' },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });
   
    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${encodeURIComponent(
        JSON.stringify({ userId, items, address, totalAmount })
      )}`,
      cancel_url: `${origin}/verify?success=false`,
      line_items,
      mode: 'payment',
    });
    
    console.log("Generated success_url:", session.success_url);
    console.log("Generated cancel_url:", session.cancel_url);
    

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


export const verifyStripe = async (req, res) => {
  // console.log("Request Body:", req.body); 
  // console.log("Request Query:", req.query); 
  // console.log("Request Headers:", req.headers); 

  const { success } = req.body; 
  const { OrderId, userId } = req.body; 
  
  // console.log("Received OrderId:", OrderId);
  // console.log("Received userId:", userId);
  // console.log("Received success:", success);
  
  if (!OrderId || !userId) {
    console.error("Missing parameters:", { OrderId, userId });
    return res.status(400).json({ success: false, message: "Order ID and User ID are required" });
  }
  
  if (success === undefined) {
    console.error("Missing 'success' query parameter");
    return res.status(400).json({ success: false, message: "'success' query parameter is required" });
  }
  

  try {
    
    const parsedOrderData = typeof OrderId === "string" ? JSON.parse(OrderId) : OrderId;
    console.log("Parsed Order Data:", parsedOrderData);

    if (success === "true") {
     
      const orderData = {
        userId,
        items: parsedOrderData.items,
        address: parsedOrderData.address,
        amount: parsedOrderData.totalAmount,
        paymentMethod: "Stripe",
        payment: true,
        date: new Date().toISOString(),
      };

      
      const newOrder = new OrderModel(orderData);
      await newOrder.save();

      
      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      return res.json({ success: true, message: "Payment verified and order placed successfully." });
    } else {
     
      return res.json({ success: false, message: "Payment failed, order not placed." });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: "Order ID is required" });
    }

    await OrderModel.findByIdAndDelete(orderId);
    res.json({ success: true, message: "Order canceled successfully" });
  } catch (error) {
    console.error("Error canceling order:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



export const allOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await OrderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: "Order ID and status are required" });
    }

    if (status === "Delivered") {
      // Remove order from the database
      await OrderModel.findByIdAndDelete(orderId);
      return res.json({ success: true, message: "Order marked as delivered and removed" });
    } else {
      // Update status for other cases
      await OrderModel.findByIdAndUpdate(orderId, { status });
      res.json({ success: true, message: "Order status updated" });
    }
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

