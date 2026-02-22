import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, type NodeChange, type EdgeChange, type Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { PriceTrigger } from '@/nodes/trigger/priceTrigger';
import { Timer } from '@/nodes/trigger/timer';
import { TradeAction } from '@/nodes/actions/TradeAction';
import type { EdgeType, NodeType, UpdateWorkflowDTO, WorkflowItem } from '@/types/workflow.types';
import { getById, saveWorkflow, updateWorkflow } from '@/utils/workflow';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Zap } from 'lucide-react';
import { CreateTrigger } from '@/components/CreateTrigger';
import { Button } from '@/components/ui/button';
import { SaveWorkflow } from '@/components/saveWorkFlow';
import { CreateAction } from '@/components/CreateActions';
const nodeTypes = { 
    "price-trigger": PriceTrigger,
    "time-trigger": Timer,
    "hyperliquid": TradeAction,
    "bagpack": TradeAction,
    "lighter": TradeAction
}


const WorkflowSheet = () => {
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [edges, setEdges] = useState<EdgeType[]>([]);
  const [actionSideBarOpen, setActionSidebarOpen] = useState(false);
  const [fromSource, setFromSource] = useState("");
  const [existingWorkflowId, setExistingWorkflowId] = useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => { 
    const id = searchParams.get("id");
    console.log("id is " + id);
    if (id === null) { 
      return;
    }
    setExistingWorkflowId(id);
    (async () => {
      try {
        const item = await getById(id);
        if (item === undefined) {
          return;
        }
        setNodes(item.nodes);
        setEdges(item.edges);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [])
  const navigate = useNavigate();
  const onNodesChange = useCallback(
    (changes: NodeChange<NodeType>[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );
  const onConnectEnd = useCallback(
    (param: any , connectionInfo: any) => { 
        console.log(connectionInfo)
        setActionSidebarOpen(true)
        console.log(actionSideBarOpen);
        setFromSource(connectionInfo.fromNode.id);
    },
    []
  )
  
  const [toBeCreated, setTobeCreated] = useState(false);
 
  return (
    <>
    {!nodes.length && <CreateTrigger onSelect={(type, metadata) => setNodes((nodes) => [...nodes, 
        {
            type, 
            data: { 
                kind: "trigger",
                label: type,
                metadata
            },
            id: Math.random().toString(), 
            position: { x: 0, y: 0}
        }
    ])}/>}
    <div className="flex h-screen w-full flex-col bg-background">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link to="/dashboard" aria-label="Back to dashboard">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Zap className="size-5 text-primary" />
            <span className="font-semibold text-foreground">Workflow editor</span>
          </div>
        </div>
        <Button onClick={() => setTobeCreated(true)} className="gap-2">
          <Save className="size-4" />
          Save workflow
        </Button>
      </header>
      <div className="h-0 flex-1">
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectEnd={onConnectEnd}
          fitView
          className="bg-muted/30"
        />
      </div>
    </div>
    {toBeCreated && <SaveWorkflow onSave={async (name, id, status, triggerType, cancelled) => {
      // if existing workflow update it 
      if(cancelled) { 
        navigate('/dashboard')
        return;
      }
      if(existingWorkflowId) { 
        let updateWorkflowItem: UpdateWorkflowDTO = {
          name,
          status,
          nodes,
          edges
        }
        try {
          await updateWorkflow(updateWorkflowItem, existingWorkflowId);
        } catch (error) {
          console.error(error);
          return;
        }
        setTobeCreated(false);
        navigate('/dashboard');
        return
      }
      let workflow: WorkflowItem = { 
        id,
        name,
        status,
        triggerType,
        updatedAt: 'now',
        nodes,
        edges
      }
      try {
        const accessToken = localStorage.getItem('accessToken');
        const userId = localStorage.getItem('userId');
        await saveWorkflow(workflow, userId??'', accessToken??'');
      } catch (error) {
        console.error(error);
        return;
      }
      setTobeCreated(false);
      navigate('/dashboard');
    }}/>}
    {actionSideBarOpen && <CreateAction onSelect={(type, metadata, id) => setNodes((nodes) => [...nodes, 
        {
            type, 
            data: { 
                kind: "action",
                label: type,
                metadata
            },
            id, 
            position: { x: 0, y: 0}
        }
    ])} source={fromSource} onConnect={(source, target) => { 
        setEdges(edges=> [
            ...edges,
            { 
                id: Math.random().toString(),
                source,
                target
            }
        ])
        setActionSidebarOpen(false);
        setFromSource("");
    }} />}
    
    </>
  );
}

export default WorkflowSheet;
