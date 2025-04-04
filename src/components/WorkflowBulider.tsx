import { useCallback, useState } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
} from "@xyflow/react";
import type { Node, Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import AddEdge from "./AddEdge";
import StartNode from "./Startnode";
import EndNode from "./Endnode";
import ActionNode from "./ActionNode";
import EditNodeModal from "./EditNodeModal";

type NodeData = {
  label: string;
};

// Custom edge types
const edgeTypes = {
  add: AddEdge,
};

// Node types for rendering
const nodeTypes = {
  start: StartNode,
  end: EndNode,
  action: ActionNode,
};

// Initial nodes
const initialNodes = [
  {
    id: "1",
    type: "start",
    position: { x: 200, y: 200 },
    data: { label: "Start" },
  },
  {
    id: "2",
    type: "end",
    position: { x: 500, y: 500 },
    data: { label: "End" },
  },
];

export default function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] =
    useNodesState<Node<NodeData>>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([
    {
      id: "e-1-2",
      source: "1",
      target: "2",
      type: "add",
      animated: true,
      data: {
        onAdd: () => addNodeBetweenEdge("1", "2"),
      },
    },
  ]);
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNodeBetweenEdge = useCallback((source: string, target: string) => {
    setNodes((prevNodes) => {
      const sourceNode = prevNodes.find((n) => n.id === source);
      const targetNode = prevNodes.find((n) => n.id === target);
      if (!sourceNode || !targetNode) return prevNodes;

      const midY =
        sourceNode.position.y +
        (targetNode.position.y - sourceNode.position.y) / 2;

      const avgX =
        sourceNode.position.x +
        (targetNode.position.x - sourceNode.position.x) / 2;

      const id = crypto.randomUUID();
      const newNode: Node<NodeData> = {
        id,
        type: "action",
        position: { x: avgX, y: midY },
        data: {
          label: `Action`,
        },
      };

      const updatedNodes = prevNodes.map((node) => {
        if (node.position.y > midY) {
          return {
            ...node,
            position: { ...node.position, y: node.position.y + 100 },
          };
        }
        return node;
      });

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
              onAdd: () => addNodeBetweenEdge(source, id),
            },
          },
          {
            id: `e-${id}-${target}`,
            source: id,
            target,
            type: "add",
            animated: true,
            data: {
              onAdd: () => addNodeBetweenEdge(id, target),
            },
          },
        ];

        return [...filteredEdges, ...newEdges];
      });

      return [...updatedNodes, newNode];
    });
  }, []);

  return (
    <>
      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          edgeTypes={edgeTypes}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(_, node: Node<NodeData>) => {
            if (node.type === "action") {
              setSelectedNode(node);
            }
          }}
        >
          <Controls className="text-black" />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
        {selectedNode && (
          <EditNodeModal
            node={selectedNode}
            onSave={(updatedNode) => {
              setNodes((nodes) =>
                nodes.map((n) => (n.id === updatedNode.id ? updatedNode : n))
              );
            }}
            onDelete={(nodeId) => {
              setNodes((nodes) => nodes.filter((n) => n.id !== nodeId));
              setEdges((edges) =>
                edges.filter((e) => e.source !== nodeId && e.target !== nodeId)
              );
            }}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>
    </>
  );
}
