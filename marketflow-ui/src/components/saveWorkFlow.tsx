import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import type { Status } from "@/types/workflow.types"
const allStatus = ["active", "paused", "drift"]
const triggers = ['price-trigger', 'time-trigger']
export function SaveWorkflow({onSave} : {onSave: (name: string, id: string, status: Status, triggerType: string, cancelled: boolean) => void}) {
    const [name, setName] = useState("");
    const [triggerType, setTriggerType] = useState(triggers[1]);
    const [status, setStatus] = useState<Status>("active")
    return (
    <Dialog open={true}>
      <form>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" value={name} onChange={e => setName(e.target.value)}/>
            </Field>
          </FieldGroup>
          <Select value={triggerType} onValueChange={(v) => setTriggerType(v)}>
            <SelectTrigger id="trigger-type" className="w-full">
              <SelectValue placeholder="Select a trigger" />
            </SelectTrigger>
            <SelectContent>
              {triggers.map(trigger => (
                <SelectItem key={trigger} value={trigger}>
                  {trigger}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
            <SelectTrigger id="trigger-type" className="w-full">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              {allStatus.map(status => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={()=>onSave("", "", status, triggerType, true)}>Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={()=> onSave(name, Math.random().toString(), status, triggerType, false)}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
