import getHospitalBySessionToken from "../hospitals/getHospitalBySessionToken";

const getSessionToken = async (sessionToken: string) => {
  const hospital = await getHospitalBySessionToken(sessionToken);
  if (hospital) {
    return { type: "hospital", user: hospital };
  }

  return null;
};

export default getSessionToken;
