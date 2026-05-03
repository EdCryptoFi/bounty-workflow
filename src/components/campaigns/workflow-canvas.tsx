"use client";

import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { Step } from "@/lib/types";

/**
 * WorkflowCanvas — visualização em grafo dos steps de uma campanha.
 * Drill-down do mockup aprovado v2: uma campanha clicada mostra seu workflow.
 * Por enquanto, layout vertical sequencial por order_index.
 */
export function WorkflowCanvas({ steps }: { steps: Step[] }) {
  const { nodes, edges } = useMemo(() => buildGraph(steps), [steps]);

  if (steps.length === 0) {
    return (
      <div className="grid h-[360px] place-items-center rounded-2xl border border-dashed border-border bg-muted/20">
        <p className="text-sm text-muted-foreground">
          Adicione tarefas pra ver o workflow visual.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[420px] overflow-hidden rounded-2xl border border-border bg-card">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
      >
        <Background gap={16} size={1} color="rgb(229 231 235)" />
        <Controls showInteractive={false} />
        <MiniMap pannable zoomable className="!bg-background" />
      </ReactFlow>
    </div>
  );
}

function buildGraph(steps: Step[]): { nodes: Node[]; edges: Edge[] } {
  const sorted = [...steps].sort((a, b) => a.order_index - b.order_index);

  const nodes: Node[] = sorted.map((s, i) => ({
    id: s.id,
    position: { x: (i % 3) * 240, y: Math.floor(i / 3) * 130 },
    data: { label: s.title },
    style: nodeStyleFor(s.status),
  }));

  const edges: Edge[] = [];
  for (let i = 1; i < sorted.length; i++) {
    edges.push({
      id: `${sorted[i - 1].id}->${sorted[i].id}`,
      source: sorted[i - 1].id,
      target: sorted[i].id,
      animated: sorted[i].status === "in_progress",
      markerEnd: { type: MarkerType.ArrowClosed, color: "rgb(20 184 166)" },
      style: { stroke: "rgb(20 184 166)" },
    });
  }

  return { nodes, edges };
}

function nodeStyleFor(status: Step["status"]): React.CSSProperties {
  if (status === "done") {
    return {
      background: "rgb(240 253 250)",
      border: "1px solid rgb(20 184 166)",
      color: "rgb(19 78 74)",
      borderRadius: 12,
      padding: 10,
      fontSize: 12,
      width: 200,
    };
  }
  if (status === "in_progress") {
    return {
      background: "rgb(255 255 255)",
      border: "2px solid rgb(45 212 191)",
      color: "rgb(19 78 74)",
      borderRadius: 12,
      padding: 10,
      fontSize: 12,
      fontWeight: 500,
      width: 200,
    };
  }
  return {
    background: "rgb(255 255 255)",
    border: "1px dashed rgb(203 213 225)",
    color: "rgb(71 85 105)",
    borderRadius: 12,
    padding: 10,
    fontSize: 12,
    width: 200,
  };
}
