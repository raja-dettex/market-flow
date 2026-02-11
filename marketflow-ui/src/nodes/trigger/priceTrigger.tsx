import type { PriceTriggerMetadata } from "@/types/workflow.types"
import { Handle, Position  } from "@xyflow/react"

export type AssetType = "SOL" | "BTC" | "ETH"


export const PriceTrigger = ({data, isConnectable} : {
    data: { 
        metadata: PriceTriggerMetadata
    },
    isConnectable: boolean
}) => { 
    return<div className="border p-4">
    asset: {data.metadata.asset}<br></br>
    price: {data.metadata.price} 
    <Handle type="source" position={Position.Right}></Handle>
    </div>
}