import { auth } from "../../lib/auth";

interface IRegister {
  name: string;
  email: string;
  password: string;
}
const registerPatient = async (payload: IRegister) => {
  const { name, email, password } = payload;
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });
  if (!data.user) {
    throw new Error("Failed to register user");
  }
  //  const patient= await prisma.$transaction(async (tx) =>
  return data;
};

export const AuthService = {
  registerPatient,
};
