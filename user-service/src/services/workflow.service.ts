import { UpdateWorkflowDTO, Workflow, WorkflowItemDto } from "../db/types";
import { IUserRepository } from "../repository/user.repository";
import { IWorkflowRepository } from "../repository/workflow.repsository";

export class WorkflowService {
  constructor(
    private readonly workflowRepository: IWorkflowRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async createWorkflow(workflow: Workflow, userId: string): Promise<string | null> {
    const user = await this.userRepository.getUserById(userId);
    if (user == null) {
      return null;
    }
    const workflowItemId = await this.workflowRepository.addWorkflow(workflow);
    console.log(workflowItemId);
    const existingWorkflows = user.workflows;
    await this.userRepository.updateUser(
      { workflows: [...existingWorkflows, workflowItemId] },
      userId
    );
    return workflowItemId;
  }

  async updateWorkflow(workflow: UpdateWorkflowDTO, id: string): Promise<void> {
    await this.workflowRepository.updateWorkflow(workflow, id);
  }

  async getWorkflowById(id: string): Promise<Workflow | null> {
    return this.workflowRepository.getWorkflowById(id);
  }

  async deleteWorkflow(id: string): Promise<void> {
    await this.workflowRepository.deleteWorkflow(id);
  }

  workflowItemToDto(item: any) : WorkflowItemDto { 
    return { id: item._id.toString(), name: item.name, status: item.status, triggerType: item.triggerType, updatedAt: item.updatedAt}
  } 

  async getAllWorkflows(): Promise<WorkflowItemDto[]> {
   return (await this.workflowRepository.getAllWorkflows()).map(this.workflowItemToDto)
  }
}
