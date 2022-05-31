const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const mapOrder = require('../mappers/order');

module.exports.checkout = async function checkout(ctx, next) {
  const {body} = ctx.request;
  const order = await Order.create({
    user: ctx.user.id,
    product: body.product,
    phone: body.phone,
    address: body.address,
  });
  await order.populate('product');
  await sendMail({
    to: ctx.user.email,
    subject: 'Подтверждение заказа',
    template: 'order-confirmation',
    locals: {
      id: order.id,
      product: {
        title: order.product.title,
      },
    },
  });
  ctx.body = {order: order.id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({user: ctx.user.id}).populate('product');
  ctx.body = {orders: orders.map(mapOrder)};
};
