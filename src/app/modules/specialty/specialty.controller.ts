import { Request, Response } from "express";
import { SpecialtyService } from "./specialty.service";

const createSpecialty = async (req: Request, res: Response) => {
  try {
    const result = await SpecialtyService.createSpecialty(req.body);
    res.status(201).json({
      success: true,
      message: "Specialty created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create specialty",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getAllSpecialties = async (req: Request, res: Response) => {
  try {
    const result = await SpecialtyService.getAllSpecialties();
    res.status(200).json({
      success: true,
      message: "Specialties retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve specialties",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const deleteSpecialty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;  
    const result = await SpecialtyService.deleteSpecialty(id as string);
    res.status(200).json({
      success: true,
      message: "Specialty deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete specialty",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const updateSpecialty = async(req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await SpecialtyService.updateSpecialty(id as string, req.body);
        res.status(200).json({
            success: true,
            message: "Specialty updated successfully",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update specialty",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}

export const SpecialtyController = {
  createSpecialty,
  getAllSpecialties,
  deleteSpecialty,
  updateSpecialty
};
