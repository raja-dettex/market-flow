import { Request, Response } from "express";
import { WorkflowItemDto, UpdateWorkflowDTO, Workflow } from "../db/types";
import { UserRepository } from "../repository/user.repository";
import { WorkflowRepository } from "../repository/workflow.repsository";
import { WorkflowService } from "../services/workflow.service";

const workflowService = new WorkflowService(
  new WorkflowRepository(),
  new UserRepository()
);

export const createWorkflow = async (req: Request, res: Response) => {
  try {
    console.log(req.query)
    const userId = req.query['userId'] as string;
    if (!userId) {  
      return res.status(400).json({ error: "userId is required" });
    }
    const workflow = req.body as Workflow;
    const workflowId = await workflowService.createWorkflow(workflow, userId);
    if (!workflowId) {
      return res.status(500).json({ error: "failed to create workflow" });
    }
    return res.status(201).json({ id: workflowId });
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Failed to create workflow" });
  }
};

export const updateWorkflow = async (req: Request, res: Response) => {
  try {
    const id = String(req.query.id ?? "");
    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }
    const update = req.body as UpdateWorkflowDTO;
    await workflowService.updateWorkflow(update, id);
    return res.status(200).json({ message: "workflow updated", id });
  } catch {
    return res.status(500).json({ error: "Failed to update workflow" });
  }
};

export const deleteWorkflow = async (req: Request, res: Response) => {
  try {
    const id = String(req.query.id ?? "");
    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }
    await workflowService.deleteWorkflow(id);
    return res.status(200).json({ message: "workflow deleted", id });
  } catch {
    return res.status(500).json({ error: "Failed to delete workflow" });
  }
};

export const getAllWorkflows = async (_req: Request, res: Response) => {
  try {
    const workflows = await workflowService.getAllWorkflows();
    return res.status(200).json({ data: workflows });
  } catch {
    return res.status(500).json({ error: "Failed to fetch workflows" });
  }
};

export const getWorkflowById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const workflow = await workflowService.getWorkflowById(id as string);
    if (!workflow) {
      return res.status(404).json({ error: "workflow not found" });
    }
    return res.status(200).json({ data: workflow });
  } catch(err) {
    console.log(err)
    return res.status(500).json({ error: "Failed to fetch workflow" });
  }
};
