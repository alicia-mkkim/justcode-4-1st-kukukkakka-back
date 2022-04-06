const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createUserCart = async (
  userId,
  productId,
  addOptionId,
  quantity,
  totalPrice
) => {
  return await prisma.$queryRaw`
  INSERT INTO product_carts 
  (user_id, product_id, add_option_id, quantity, totalPrice, order_status) 
  VALUES 
  (${userId}, ${productId}, ${addOptionId}, ${quantity}, ${totalPrice}, "주문 전")`;
};

const getUserCart = async (userId) => {
  return await prisma.$queryRaw`
  SELECT C.user_id As userId,  
  P.name As productName, 
  P.image_url As imageUrl, 
  P.price As productPrice, 
  C.quantity As productQuantity, 
  C.totalprice As totalPrice, 
  json_arrayagg(A.name) As addOptionName, 
  json_arrayagg(A.price) As addOptionPrice, 
  C.order_status As orderStatus 
  
  FROM product_carts C 
  JOIN products P 
  ON P.id = C.product_id 
  JOIN add_options A 
  ON A.id = C.add_option_id
  WHERE C.user_id = ${userId}
  GROUP BY C.product_id, C.user_id, C.quantity, C.totalprice, C.order_status;`;
};

module.exports = { createUserCart, getUserCart };