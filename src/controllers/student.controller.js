import prisma from "../config/prisma.js";

export const addStudent = async (req, res) => {
  try {
    const newStudent = await prisma.student.create({
      data: req.body,
    });

    res.status(201).json({
      success: true,
      message: "Student added successfully",
      student: newStudent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add student",
      error: error.message,
    });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany();

    res.status(200).json({
      success: true,
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get students",
      error: error.message,
    });
  }
};

export const getStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get student",
      error: error.message,
    });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const existingStudent = await prisma.student.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const updatedStudent = await prisma.student.update({
      where: {
        id: Number(id),
      },
      data: req.body,
    });

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update student",
      error: error.message,
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const existingStudent = await prisma.student.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    await prisma.student.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete student",
      error: error.message,
    });
  }
};