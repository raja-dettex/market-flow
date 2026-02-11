import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import type { NodeKind, TradeActionMetadata } from "@/types/workflow.types"
interface ActionType { 
    id: NodeKind,
    title: string,
    description: string
}


const assets = [
    "SOL",
    "BTC",
    "ETH"
]
const SUPPORTED_EXCHANGES: ActionType[] = [
    {
        id: "hyperliquid",
        title: "HyperLiquid",
        description: "place a trade on hyper liquid"
    },
    {
        id: "bagpack",
        title: "Bagpack",
        description: "place a trade on bagpack"
    },
    {
        id: "lighter",
        title: "Lighter",
        description: "place a trade on lighter" 
    }
]

export const CreateAction = ({
    onSelect, onConnect, source
}: {
    onSelect: (kind: NodeKind, metadata: TradeActionMetadata, id: string) => void,
    onConnect: ( source: string, target: string) => void 
    source: string}) => {
    const [metadata, setMetadata] = useState<TradeActionMetadata>({
        amount: 0, 
        exchange: "hyperliquid",
        asset: "SOL",
        "orderType": "buy"
    })
    console.log("lauychidn this");    
    const [ selectedTrigger, setSelectedTrigger] = useState(SUPPORTED_EXCHANGES[0].id);
    console.log(open)
    const [target, setTarget] = useState()
  return (
    <Sheet open={true}>
      <SheetTrigger asChild>
        <Button variant="outline">create trigger</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create your actions</SheetTitle>
          <SheetDescription>
           Here you will create actions for your workflow
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-2 py-4">
          <Label htmlFor="trigger-type">Trigger type</Label>
          <Select value={selectedTrigger} onValueChange={(v) => setSelectedTrigger(v as NodeKind)}>
            <SelectTrigger id="trigger-type" className="w-full">
              <SelectValue placeholder="Select a trigger" />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_EXCHANGES.map(({ id, title }) => (
                <SelectItem key={id} value={id}>
                  {title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={metadata.asset} onValueChange={(v) => setMetadata(m => ({...m, asset : v}))}>
            <SelectTrigger id="trigger-type" className="w-full">
              <SelectValue placeholder="Select a trigger" />
            </SelectTrigger>
            <SelectContent>
              {assets.map(asset => (
                <SelectItem key={asset} value={asset}>
                  {asset}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="text" value={metadata.amount} onChange={e=> setMetadata(metadata=>({...metadata, amount: Number(e.target.value)}))}></Input>
          
        </div>
        <SheetFooter>
          <Button onClick = {() => { 
            const id = Math.random().toString();
            onSelect(selectedTrigger, metadata, id);
            onConnect(source, id);
        }} type="submit">create trigger</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
