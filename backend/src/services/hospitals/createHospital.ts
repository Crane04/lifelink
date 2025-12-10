import { HospitalModel, Hospital } from "../../db/hospitals";
import { random, authentication } from "../../helpers";

class CreateHospital {
  private static async execute(
    values: Omit<Hospital, "authentication"> & {
      authentication: {
        salt: string;
        password: string;
      };
    }
  ): Promise<Hospital> {
    const hospital = await new HospitalModel(values).save();
    return hospital.toObject({
      transform: (doc, ret) => {
        delete ret.authentication;
        return ret;
      },
    });
  }

  public static async run(
    email: string,
    name: string,
    password: string,
    type: string,
    address: string
  ): Promise<Hospital> {
    const salt = random();

    console.log(email, name, password, type, address);

    return this.execute({
      email,
      name,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
      type,
      address,
    });
  }
}

export default CreateHospital;
