import { Node, Edge } from "@xyflow/react";

type Branch = {
  id: string;
  label: string;
};

export function addIfElseStructure(
  source: string,
  target: string,
  modalData: { name: string; branches: Branch[] },
  nodes: Node[],
  setNodes: (updater: (nodes: Node[]) => Node[]) => void,
  setEdges: (updater: (edges: Edge[]) => Edge[]) => void,
  setSelectorPosition: (pos: any) => void,
  setEdgeToSplit: (info: any) => void,
  openEditModal: (nodeId: string) => void
) {
  const sourceNode = nodes.find((n) => n.id === source);
  const targetNode = nodes.find((n) => n.id === target);
  if (!sourceNode || !targetNode) return;

  const midX = (sourceNode.position.x + targetNode.position.x) / 2;
  const midY = (sourceNode.position.y + targetNode.position.y) / 2;

  const ifElseId = crypto.randomUUID();

  const ifElseNode: Node = {
    id: ifElseId,
    type: "ifelse",
    position: { x: midX, y: midY },
    data: {
      label: modalData.name,
      onEdit: () => openEditModal(ifElseId),
    },
  };

  const newBranchNodes: Node[] = modalData.branches.map((branch, index) => ({
    id: branch.id,
    type: "branchlabel",
    position: {
      x: midX - (modalData.branches.length * 100) / 2 + index * 100,
      y: midY + 120,
    },
    data: { label: branch.label },
    draggable: false,
    selectable: false,
  }));

  // Update nodes
  setNodes((prev) => [...prev, ifElseNode, ...newBranchNodes]);

  // Update edges
  setEdges((prev) => {
    const filtered = prev.filter(
      (e) => !(e.source === source && e.target === target)
    );

    const connectingEdges: Edge[] = [
      {
        id: `e-${source}-${ifElseId}`,
        source,
        target: ifElseId,
        type: "add",
        animated: true,
        data: {
          onAdd: (e: React.MouseEvent) => {
            const bounds = (e.target as HTMLElement).getBoundingClientRect();
            setSelectorPosition({ x: bounds.left, y: bounds.top });
            setEdgeToSplit({ source, target: ifElseId });
          },
        },
      },
      ...modalData.branches.map((branch) => ({
        id: `e-${ifElseId}-${branch.id}`,
        source: ifElseId,
        target: branch.id,
        type: "add",
        animated: true,
        data: {
          onAdd: (e: React.MouseEvent) => {
            const bounds = (e.target as HTMLElement).getBoundingClientRect();
            setSelectorPosition({ x: bounds.left, y: bounds.top });
            setEdgeToSplit({ source: ifElseId, target: branch.id });
          },
        },
      })),
    ];

    return [...filtered, ...connectingEdges];
  });

  setSelectorPosition(null);
  setEdgeToSplit(null);
}
