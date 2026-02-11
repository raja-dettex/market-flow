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
} from "@/components/ui/sheet"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import type { NodeKind, PriceTriggerMetadata, TimerMetadata } from "@/types/workflow.types"

interface TriggerType { 
    id: NodeKind,
    title: string
}


const assets = [
    "SOL",
    "BTC",
    "ETH"
]
const SUPPORTED_TRIGGERS: TriggerType[] = [
    {
        id: "price-trigger",
        title: "Price trigger",
    },
    {
        id: "time-trigger",
        title: "Time trigger",
    }
]

export const CreateTrigger = ({
    onSelect
}: {onSelect: (kind: NodeKind, metadata: TimerMetadata | PriceTriggerMetadata) => void}) => {
    const [metadata, setMetadata] = useState<TimerMetadata | PriceTriggerMetadata>({
        time: 0
    })
    const [ selectedTrigger, setSelectedTrigger] = useState(SUPPORTED_TRIGGERS[0].id);
  return (
    <Sheet open={true}>
      {/* <SheetTrigger asChild>
        <Button variant="outline">create trigger</Button>
      </SheetTrigger> */}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create your trigger</SheetTitle>
          <SheetDescription>
           Here you will create trigger for your workflow
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-2 py-4">
          <Label htmlFor="trigger-type">Trigger type</Label>
          <Select value={selectedTrigger} onValueChange={(v) => setSelectedTrigger(v as NodeKind)}>
            <SelectTrigger id="trigger-type" className="w-full">
              <SelectValue placeholder="Select a trigger" />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_TRIGGERS.map(({ id, title }) => (
                <SelectItem key={id} value={id}>
                  {title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedTrigger === "price-trigger" && (<div>
            asset:
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
            price:
              <Input type="text" value={metadata.price} onChange={e=> setMetadata(metadata=>({...metadata, price: Number(e.target.value)}))}></Input>
          </div>)}
          {selectedTrigger === "time-trigger" && (<div>
            timer: 
            <Input type="text" value={metadata.time} onChange={e=> setMetadata(metadata=>({...metadata, time: Number(e.target.value)}))}></Input>

          </div>)}
        </div>
        <SheetFooter>
          <Button onClick = {() => onSelect(selectedTrigger, metadata)} type="submit">create trigger</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
