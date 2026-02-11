import { Router } from "express";
import {
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  getAllWorkflows,
  getWorkflowById,
} from "../controllers/workflow.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

export const workflowRouter = Router();

workflowRouter.post("/create", authMiddleware, createWorkflow);
workflowRouter.put("/update", authMiddleware, updateWorkflow);
workflowRouter.delete("/delete", authMiddleware,  deleteWorkflow);
workflowRouter.get("/all", authMiddleware, getAllWorkflows);
workflowRouter.get("/:id", authMiddleware,getWorkflowById);
