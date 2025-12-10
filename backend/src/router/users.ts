import express from "express";
import { validateUser } from "../middlewares/validateUser";
import AuthController from "../controllers/AuthController";
import updateProfileValidator from "../validators/profile/updateProfile";
import ProfileController from "../controllers/ProfileController";
import upload from "../middlewares/multer";
import { validateHospital } from "../middlewares/validateHospital";
import createUserValidator from "../validators/authentication/createUserValidator";
import Hospital from "../controllers/HospitalControllers";

export default (router: express.Router) => {
  router.get("/users/retrieve", validateUser, AuthController.getUser);
  router.post(
    "/users/register",
    validateHospital,
    createUserValidator,
    AuthController.register
  );
  router.post("/users/login", AuthController.login);
  router.get("/users/profile", validateUser, AuthController.getUserProfile);
  router.put(
    "/users/update/:username",
    validateHospital,
    updateProfileValidator,
    ProfileController.updateUserProfile
  );
  router.get("/users/all", validateHospital, AuthController.getAllUsers);
  router.put(
    "/users/profile/image/:username",
    validateHospital,
    upload.single("image"),
    ProfileController.updateImage
  );

  router.get(
    "/users/profile/:username",
    validateHospital,
    Hospital.getUserProfile
  );

  router.put(
    "/users/profile/:username",
    updateProfileValidator,
    validateHospital,
    ProfileController.updateUserProfileByHospital
  );
};
