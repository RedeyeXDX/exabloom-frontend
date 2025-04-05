// src/utils/addNodeBetweenEdge.ts
import { Node, Edge } from "@xyflow/react";

export type NodeData = {
  label: string;
};

export function addNodeBetweenEdgeHelper(
  source: string,
  target: string,
  nodes: Node<NodeData>[],
  setNodes: React.Dispatch<React.SetStateAction<Node<NodeData>[]>>,
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  nodeType: "action" | "ifelse",
  setSelectorPosition: (pos: { x: number; y: number }) => void,
  setEdgeToSplit: (info: { source: string; target: string }) => void
) {
  const sourceNode = nodes.find((n) => n.id === source);
  const targetNode = nodes.find((n) => n.id === target);
  if (!sourceNode || !targetNode) return;

  const midY =
    sourceNode.position.y + (targetNode.position.y - sourceNode.position.y) / 2;
  const avgX =
    sourceNode.position.x + (targetNode.position.x - sourceNode.position.x) / 2;

  const id = crypto.randomUUID();

  const newNode: Node<NodeData> = {
    id,
    type: nodeType,
    position: { x: avgX, y: midY },
    data: {
      label: nodeType === "action" ? "Action" : "If/Else",
    },
  };

  const updatedNodes = nodes.map((node) => {
    if (node.position.y > midY) {
      return {
        ...node,
        position: { ...node.position, y: node.position.y + 100 },
      };
    }
    return node;
  });

  setNodes([...updatedNodes, newNode]);

  setEdges((prevEdges) => {
    const filteredEdges = prevEdges.filter(
      (e) => !(e.source === source && e.target === target)
    );

    const newEdges: Edge[] = [
      {
        id: `e-${source}-${id}`,
        source,
        target: id,
        type: "add",
        animated: true,
        data: {
          onAdd: (e: React.MouseEvent) => {
            const bounds = (e.target as HTMLElement).getBoundingClientRect();
            setSelectorPosition({ x: bounds.left, y: bounds.top });
            setEdgeToSplit({ source, target: id });
          },
        },
      },
      {
        id: `e-${id}-${target}`,
        source: id,
        target,
        type: "add",
        animated: true,
        data: {
          onAdd: (e: React.MouseEvent) => {
            const bounds = (e.target as HTMLElement).getBoundingClientRect();
            setSelectorPosition({ x: bounds.left, y: bounds.top });
            setEdgeToSplit({ source: id, target });
          },
        },
      },
    ];

    return [...filteredEdges, ...newEdges];
  });
}
