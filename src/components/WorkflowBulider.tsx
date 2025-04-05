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
import { addNodeBetweenEdgeHelper } from "./addNodeBetweenEdgeHelper";
import NodeTypeSelectorModal from "./NodeTypeSelectorModal";
import IfElseNode from "./IfElseNode";
import BranchLabelNode from "./BranchLabelNode";
import IfElseNodeModal from "./IfElseNodeModal";
import { addIfElseStructure } from "./addIfElseStructure";

type NodeData = {
  label: string;
};

const edgeTypes = {
  add: AddEdge,
};

const nodeTypes = {
  start: StartNode,
  end: EndNode,
  action: ActionNode,
  ifelse: IfElseNode,
  branchlabel: BranchLabelNode,
};

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
        onAdd: (e: React.MouseEvent) => {
          const bounds = (e.target as HTMLElement).getBoundingClientRect();
          setSelectorPosition({ x: bounds.left, y: bounds.top });
          setEdgeToSplit({ source: "1", target: "2" });
        },
      },
    },
  ]);

  const [edgeToSplit, setEdgeToSplit] = useState<{
    source: string;
    target: string;
  } | null>(null);
  const [selectorPosition, setSelectorPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null);

  const [showIfElseModal, setShowIfElseModal] = useState(false);
  const [stagedEdge, setStagedEdge] = useState<{
    source: string;
    target: string;
  } | null>(null);

  const openIfElseEditModal = (nodeId: string) => {
    // Optional: hook to edit if/else node later
  };

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeTypeSelection = (type: "action" | "ifelse") => {
    if (!edgeToSplit) return;

    if (type === "action") {
      addNodeBetweenEdgeHelper(
        edgeToSplit.source,
        edgeToSplit.target,
        nodes,
        setNodes,
        setEdges,
        type,
        setSelectorPosition,
        setEdgeToSplit
      );
      setEdgeToSplit(null);
      setSelectorPosition(null);
    } else if (type === "ifelse") {
      setShowIfElseModal(true);
      setStagedEdge(edgeToSplit);
      setSelectorPosition(null);
    }
  };

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

        {selectorPosition && (
          <NodeTypeSelectorModal
            position={selectorPosition}
            onSelect={handleNodeTypeSelection}
            onClose={() => setSelectorPosition(null)}
          />
        )}

        {showIfElseModal && stagedEdge && (
          <IfElseNodeModal
            onSave={(modalData) => {
              addIfElseStructure(
                stagedEdge.source,
                stagedEdge.target,
                modalData,
                nodes,
                setNodes,
                setEdges,
                setSelectorPosition,
                setEdgeToSplit,
                openIfElseEditModal
              );
              setShowIfElseModal(false);
              setStagedEdge(null);
            }}
            onClose={() => {
              setShowIfElseModal(false);
              setStagedEdge(null);
            }}
          />
        )}
      </div>
    </>
  );
}
