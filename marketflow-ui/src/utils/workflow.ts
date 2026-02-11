import { type UpdateWorkflowDTO, type WorkflowItem, type WorkflowItemDto } from "@/types/workflow.types";
import axios, { AxiosError } from "axios";

const BASE_URL = "http://localhost:8000";

type ApiEnvelope<T> = {
  data: T;
};

const unwrapData = <T>(payload: T | ApiEnvelope<T>): T => {
  if (typeof payload === "object" && payload !== null && "data" in payload) {
    return (payload as ApiEnvelope<T>).data;
  }
  return payload as T;
};

const getAuthHeader = (accessToken?: string) => {
  const token = accessToken ?? localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const saveWorkflow = async (item: WorkflowItem, userId: string, accessToken?: string): Promise<WorkflowItem> => {
  try {
    const response = await axios.post<WorkflowItem | ApiEnvelope<WorkflowItem>>(
      `${BASE_URL}/workflow/create?userId=${userId}`,
      item,
      { headers: getAuthHeader(accessToken) },
    );
    return unwrapData(response.data);
  } catch (e) {
    if (e instanceof AxiosError) {
      console.log(e.toJSON());
    }
    throw e;
  }
};

const getAllWorkflows = async (accessToken?: string): Promise<WorkflowItemDto[]> => {
  try {
    const response = await axios.get<WorkflowItemDto[] | ApiEnvelope<WorkflowItemDto[]>>(
      `${BASE_URL}/workflow/all`,
      { headers: getAuthHeader(accessToken) },
    );
    return unwrapData(response.data);
  } catch (e) {
    if (e instanceof AxiosError) {
      console.log(e.toJSON());
    }
    throw e;
  }
};

const getById = async (id: string, accessToken?: string): Promise<WorkflowItem | undefined> => {
  try {
    const response = await axios.get<WorkflowItem | ApiEnvelope<WorkflowItem>>(
      `${BASE_URL}/workflow/${id}`,
      { headers: getAuthHeader(accessToken) },
    );
    return unwrapData(response.data);
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response?.status === 404) {
        return undefined;
      }
      console.log(e.toJSON());
    }
    throw e;
  }
};

const updateWorkflow = async (
  item: UpdateWorkflowDTO,
  id: string,
  accessToken?: string,
): Promise<WorkflowItem> => {
  try {
    const response = await axios.put<WorkflowItem | ApiEnvelope<WorkflowItem>>(
      `${BASE_URL}/workflow/${id}`,
      item,
      { headers: getAuthHeader(accessToken) },
    );
    return unwrapData(response.data);
  } catch (e) {
    if (e instanceof AxiosError) {
      console.log(e.toJSON());
    }
    throw e;
  }
};

export { saveWorkflow, getAllWorkflows, getById, updateWorkflow };
