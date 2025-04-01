import { Router } from "express";
import authGurd from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserControllers } from "./User.controller";
import { UserValidation } from "./User.validation";

const router = Router();

router.post(
  "/create-user",
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.createNewUser
);
router.get("/get-all-users", authGurd("admin"), UserControllers.RetriveUsers);
router.patch(
  "/deactivate-user/:id",
  authGurd("admin"),
  UserControllers.deactivateUser
);
router.patch(
  "/activate-user/:id",
  authGurd("admin"),
  UserControllers.activateUser
);

export const UserRoutes = router;
