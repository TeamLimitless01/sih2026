"use client";

import { useMemo } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Case, Entity } from "@prisma/client";

interface NetworkGraphProps {
  caseData: Case;
  entities: Entity[];
}

export function NetworkGraph({ caseData, entities }: NetworkGraphProps) {
  // Generate Nodes and Edges based on the case data
  const initialNodes = useMemo(() => {
    const nodes: any[] = [];
    const addedCaseIds = new Set<string>();

    // Main Case Node (Center)
    nodes.push({
      id: `case-${caseData.id}`,
      type: "input",
      position: { x: 400, y: 300 },
      data: { 
        label: (
          <div className="flex flex-col items-center">
            <span className="font-bold text-red-500">{caseData.caseNumber}</span>
            <span className="text-xs text-gray-500">Subject Case</span>
          </div>
        ) 
      },
      style: {
        background: "#18181b", // zinc-900
        border: "2px solid #ef4444", // red-500
        borderRadius: "8px",
        color: "#fff",
        padding: "10px 20px",
      }
    });
    addedCaseIds.add(caseData.id);

    // Generate Entity Nodes and Related Case Nodes
    const radius = 350;
    const outerRadius = 550; // For related cases

    entities.forEach((entity: any, index) => {
      // 1. Plot the Entity Node in a circle around the main case
      const angle = (index / entities.length) * 2 * Math.PI;
      const x = 400 + radius * Math.cos(angle);
      const y = 300 + radius * Math.sin(angle);

      let color = "#3b82f6"; // default blue
      if (entity.type === "PHONE") color = "#22c55e"; // green
      if (entity.type === "IP_ADDRESS") color = "#a855f7"; // purple
      if (entity.type === "BANK_ACCOUNT" || entity.type === "UPI") color = "#eab308"; // yellow

      nodes.push({
        id: `entity-${entity.id}`,
        position: { x, y },
        data: { 
          label: (
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase text-zinc-400 font-semibold mb-1">{entity.type}</span>
              <span className="font-medium text-sm">{entity.value}</span>
            </div>
          ) 
        },
        style: {
          background: "#09090b", // zinc-950
          border: `2px solid ${color}`,
          borderRadius: "12px",
          color: "#fff",
          padding: "8px 16px",
          boxShadow: `0 0 10px ${color}33`,
        }
      });

      // 2. Plot any OTHER cases that this entity is linked to (Cross-Linking!)
      if (entity.caseEntities) {
        entity.caseEntities.forEach((ce: any, ceIndex: number) => {
          const linkedCase = ce.case;
          if (!addedCaseIds.has(linkedCase.id)) {
            // Plot this linked case further out, near the entity
            const offsetAngle = angle + (ceIndex * 0.5); // Spread them out slightly if multiple
            const linkedX = 400 + outerRadius * Math.cos(offsetAngle);
            const linkedY = 300 + outerRadius * Math.sin(offsetAngle);

            nodes.push({
              id: `case-${linkedCase.id}`,
              position: { x: linkedX, y: linkedY },
              data: { 
                label: (
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-orange-400">{linkedCase.caseNumber}</span>
                    <span className="text-[10px] text-gray-500">Related Case</span>
                  </div>
                ) 
              },
              style: {
                background: "#18181b", // zinc-900
                border: "1px dashed #f97316", // orange-500
                borderRadius: "8px",
                color: "#fff",
                padding: "8px 16px",
              }
            });
            addedCaseIds.add(linkedCase.id);
          }
        });
      }
    });

    return nodes;
  }, [caseData, entities]);

  const initialEdges = useMemo(() => {
    const edges: any[] = [];
    
    entities.forEach((entity: any) => {
      // Edge from Main Case -> Entity
      edges.push({
        id: `edge-${caseData.id}-${entity.id}`,
        source: `case-${caseData.id}`,
        target: `entity-${entity.id}`,
        animated: true,
        style: { stroke: "#3f3f46", strokeWidth: 2 }, // zinc-700
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#3f3f46",
        },
      });

      // Edges from Entity -> Related Cases
      if (entity.caseEntities) {
        entity.caseEntities.forEach((ce: any) => {
          if (ce.case.id !== caseData.id) {
            edges.push({
              id: `edge-${entity.id}-${ce.case.id}`,
              source: `entity-${entity.id}`,
              target: `case-${ce.case.id}`,
              animated: true,
              style: { stroke: "#f97316", strokeWidth: 1.5, strokeDasharray: "5,5" }, // orange dashed
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: "#f97316",
              },
            });
          }
        });
      }
    });

    return edges;
  }, [caseData, entities]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  if (entities.length === 0) {
    return (
      <div className="w-full h-[75vh] min-h-[600px] flex items-center justify-center bg-zinc-950 border border-zinc-800 rounded-lg">
        <p className="text-zinc-500">Not enough data to map relationships. Please upload evidence first.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[75vh] min-h-[600px] bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 1.5 }}
        colorMode="dark"
        minZoom={0.1}
      >
        <Controls className="bg-zinc-900 border-zinc-800 fill-zinc-400" />
        <MiniMap 
          nodeColor={(n) => {
            if (n.style?.border) return n.style.border.toString().split(" ")[2] || "#3b82f6";
            return "#3b82f6";
          }}
          maskColor="rgba(0,0,0, 0.7)"
          className="bg-zinc-950"
        />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#27272a" />
      </ReactFlow>
    </div>
  );
}
