import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Workflow, Plus } from "lucide-react";
import { getAllWorkflows } from "@/utils/workflow";
import { useEffect, useState } from "react";
import type {  WorkflowItemDto } from "@/types/workflow.types";



// Mock data for now – replace with real data/API later

function Dashboard() {
  const [workflowItems, setWorkflowItems] = useState<WorkflowItemDto[]>([]);
  
  useEffect( () => { 
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken == null) { 
      return;
    }
    getAllWorkflows(accessToken).then(workflows =>  { 
      console.log(workflows);
      setWorkflowItems(workflows)
    }).catch(error => console.error(error));
  }, [])
  console.log(workflowItems.length)
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Workflows
          </h1>
          <p className="mt-1 text-muted-foreground">
            Create and manage your automation workflows.
          </p>
        </div>

        {workflowItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center">
            <Workflow className="size-12 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-medium text-foreground">
              No workflows yet
            </h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Create your first workflow to start automating trades and alerts.
            </p>
            <Button asChild className="mt-6">
              <Link to="/create-workflow" className="flex items-center gap-2">
                <Plus className="size-4" />
                Create workflow
              </Link>
            </Button>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workflowItems.length > 0 && workflowItems.map((w) => (
              <li key={w.id}>
                <Link
                  to={`/workflows?id=${w.id}`}
                  className="block rounded-lg border border-border bg-card p-4 shadow-sm transition-colors hover:bg-accent/50 hover:border-primary/30"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">
                        {w.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {w.triggerType}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Updated {w.updatedAt}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                        w.status === "active"
                          ? "bg-green-500/15 text-green-700 dark:text-green-400"
                          : w.status === "paused"
                            ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {w.status}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
