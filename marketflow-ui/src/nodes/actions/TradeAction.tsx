import type { TradeActionMetadata } from "@/types/workflow.types"
import { Handle, Position  } from "@xyflow/react"

export type AssetType = "SOL" | "BTC" | "ETH"


export const TradeAction = ({data, isConnectable} : {
    data: { 
        metadata: TradeActionMetadata
    },
    isConnectable: boolean
}) => { 
    const { asset, amount, exchange, orderType} = data.metadata;
    return<div className="border p-4">
    place {amount} {asset} {orderType} order on {exchange} 
    <Handle type="target" position={Position.Left}></Handle>
    </div>
}