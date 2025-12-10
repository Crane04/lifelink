import { Request, Response } from "express";
import ApiResponse from "../helpers/ApiResponse";
import CreateHospital from "../services/hospitals/createHospital";
import LoginHospital from "../services/hospitals/loginHospital";
import { get } from "lodash";
import getUserProfileByUsername from "../services/profile/getUserProfileByUsername";
import sendEmail from "../utils/mail";
import verifyingMail from "../utils/verifyingMail";
import getHospitalByEmail from "../services/hospitals/getHospitalByEmail";
import verifiedMail from "../utils/verifiedMail";

class Hospital {
  static register = async (req: Request, res: Response): Promise<any> => {
    const { email, password, name, type, address } = req.body;

    const hospital = await CreateHospital.run(
      email,
      name,
      password,
      type,
      address
    );
    if (!hospital) {
      ApiResponse.error(res, "Couldn't create account, try again", 400);
      return;
    }

    ApiResponse.success(res, "Hospital created successfully!", hospital);
  };

  static login = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;
    const hospital = await LoginHospital.run(email, password);

    if (typeof hospital === "object" && hospital !== null) {
      if (!hospital.verified) {
        ApiResponse.error(res, "Hospital is not verified yet!", 401);
        return;
      }
      res.cookie("sessionToken", hospital.authentication.sessionToken);
      ApiResponse.success(res, "Hospital logged in successfully", hospital);
      return;
    }

    ApiResponse.error(res, "Invalid Credentials", 400);
  };

  static getHospital = async (req: Request, res: Response): Promise<any> => {
    const hospital = get(req, "identity"); //passed from middleware

    ApiResponse.success(res, "Hospital retrieved successfully", hospital);
  };

  static getUserProfile = async (req: Request, res: Response): Promise<any> => {
    try {
      const { username } = req.params;

      const user = await getUserProfileByUsername(username);

      return ApiResponse.success(
        res,
        "User Profile retrieved successfully",
        user
      );
    } catch (error) {
      return ApiResponse.error(res, error.message, 404);
    }
  };

  static verifyHospital = async (req: Request, res: Response): Promise<any> => {
    const { email } = req.body;

    const hospital = await getHospitalByEmail(email);

    hospital.verified = true;

    await hospital.save();

    sendEmail(
      email,
      "Account Verified",
      "Your hospital's account has been verified",
      verifiedMail
    );

    return ApiResponse.success(
      res,
      "Your hospital has been verified successfully!",
      hospital
    );
  };
}

export default Hospital;
