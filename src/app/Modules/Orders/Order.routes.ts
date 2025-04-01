import { Router } from "express";

import auth from "../../middlewares/auth";
import { orderController } from "./Order.controller";
const route = Router();
route.patch("/verify-order", auth("admin"), orderController.verifyPayment);
route.post("/create-order", auth("user", "admin"), orderController.createOrder);
route.patch(
  "/change-order-status/:id",
  auth("admin"),
  orderController.changeOrderStatus
);
route.get("/get-orders", auth("admin"), orderController.getOrders);
route.get(
  "/get-customer-orders",
  auth("user"),
  orderController.getCustomerOrder
);
export const OrderRoutes = route;
