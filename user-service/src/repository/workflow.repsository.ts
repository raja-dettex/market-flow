import { WorkflowModel } from "../db/schema/workflow";
import { UpdateWorkflowDTO, Workflow, WorkflowItemDto } from "../db/types";

export interface IWorkflowRepository { 
    addWorkflow: (workflowItem: Workflow) => Promise<string>;
    updateWorkflow: (updateWorkflowItem: UpdateWorkflowDTO, id: string) => Promise<void>;
    deleteWorkflow: (id: string) => Promise<void>;
    getWorkflowById: ( id: string) => Promise<Workflow| null>;
    getAllWorkflows: () => Promise<Workflow[]>;
}



export class WorkflowRepository implements IWorkflowRepository { 
    async addWorkflow(workflowItem: Workflow) :  Promise<string> {
        const workflowToBeSaved = {...workflowItem, id: Math.random().toString()}; 
        const workflow = await new WorkflowModel(workflowToBeSaved).save();
        return workflow._id.toString();
    } 

    async updateWorkflow(updateWorkflowItem: UpdateWorkflowDTO, id: string) : Promise<void> { 
        await WorkflowModel.findByIdAndUpdate(id, updateWorkflowItem);
        return;
    }

    async deleteWorkflow(id: string): Promise<void> {
        await WorkflowModel.findByIdAndDelete(id);
        return;
    }

    async getWorkflowById(id: string):  Promise<Workflow | null> { 
        return await WorkflowModel.findById(id)
    }

    async getAllWorkflows(): Promise<Workflow[]> {
        return await WorkflowModel.find();
    }
}
