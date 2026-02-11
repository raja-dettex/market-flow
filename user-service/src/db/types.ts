export interface IUser { 
    id: string; 
    name: string;
    email: string;
    password?: string;
    googleSSOId?: string;
    phone?: string;
    role: Role
    workflows: string[],
    createdAt: Date
}

export enum Role { 
    ROLE_WORKSPACE_USER,
    ROLE_WORKSPACE_ADMIN
}

export interface IUserDTO { 
    name: string;
    email: string;
    password?: string;
    googleSSOId?: string;
    phone?: string;
    role: Role
    workflows: string[],
    createdAt: Date
}

export interface IUserUpdateDTO { 
    name?: string;
    phone?: string;
    role?: Role,
    workflows?: string[]
}
export type Kind = "action" | "trigger"
export type NodeKind = "price-trigger" | "time-trigger" | "hyperliquid" | "bagpack" | "lighter"

export type PriceTriggerMetadata = { 
    asset: string,
    price: number
}
export type TimerMetadata = { 
    time: number
}
export type TradeActionMetadata = { 
    asset: string,
    amount: number,
    exchange: string,
    orderType: string
}
export interface NodeType {
    type: NodeKind,  
    data: { 
        label: string,
        kind: Kind,
        metadata: TimerMetadata | PriceTriggerMetadata | TradeActionMetadata
    },
    id: string,
    position: { x: number, y: number },
}

export interface EdgeType { 
    id: string,
    source: string,
    target: string,
}
export type Status = "active" | "paused" | "draft";

export interface Workflow {
    id: string;
    name: string;
    triggerType: string;
    updatedAt: string;
    status: Status;
    nodes: NodeType[],
    edges: EdgeType[]
};
export type WorkflowItemDto = {
    id: string
    name: string;
    triggerType: string;
    updatedAt: string;
    status: Status;
};
export type UpdateWorkflowDTO = {
    name: string,
    status: Status,
    nodes: NodeType[],
    edges: EdgeType[]
};
