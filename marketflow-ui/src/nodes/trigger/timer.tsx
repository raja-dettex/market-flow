import type { TimerMetadata } from "@/types/workflow.types"
import { Handle, Position  } from "@xyflow/react"


export const Timer = ({data, isConnectable} : {
    data: { 
        metadata: TimerMetadata
    },
    isConnectable: boolean
}) => { 
    return<div className="border p-4">
    {data.metadata.time} 
    <Handle type="source" position={Position.Right}></Handle>
    </div>
}