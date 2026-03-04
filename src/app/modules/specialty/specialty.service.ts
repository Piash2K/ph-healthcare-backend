import { Specialty } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createSpecialty = async (payload: Specialty) => {
  const specialty = await prisma.specialty.create({
    data: payload,
  });
  return specialty;
};

const getAllSpecialties = async () => {
  const result = await prisma.specialty.findMany();
  return result;
};

const deleteSpecialty = async (id: string) =>{
    const result = await prisma.specialty.delete({
        where:{id}
    })
    return result
}

export const SpecialtyService = {
  createSpecialty,
  getAllSpecialties,
  deleteSpecialty
};
