import { Request, Response } from "express";
import { SpecialtyService } from "./specialty.service";

const createSpecialty = async(req: Request, res: Response)=>{
    try {
        const result = await SpecialtyService.createSpecialty(req.body);
        res.status(201).json({
            success: true,
            message: "Specialty created successfully",
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create specialty",
            error: error instanceof Error ? error.message : "Unknown error"
        })
    }
}

export const SpecialtyController = {
    createSpecialty
}