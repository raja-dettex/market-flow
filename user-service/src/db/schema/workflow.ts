import { Schema, model } from "mongoose";
import { Workflow } from "../types";

const nodeSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["price-trigger", "time-trigger", "hyperliquid", "bagpack", "lighter"],
      required: true,
    },
    data: {
      label: { type: String, required: true },
      kind: { type: String, enum: ["action", "trigger"], required: true },
      metadata: { type: Schema.Types.Mixed, required: true },
    },
    id: { type: String, required: true },
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
  },
  { _id: false }
);

const edgeSchema = new Schema(
  {
    id: { type: String, required: true },
    source: { type: String, required: true },
    target: { type: String, required: true },
  },
  { _id: false }
);

export const workflowSchema = new Schema<Workflow>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    triggerType: { type: String, required: true },
    updatedAt: { type: String, required: true },
    status: { type: String, enum: ["active", "paused", "draft"], required: true },
    nodes: { type: [nodeSchema], default: [] },
    edges: { type: [edgeSchema], default: [] },
  },
  { timestamps: true }
);

export const WorkflowModel = model<Workflow>("Workflow", workflowSchema);
