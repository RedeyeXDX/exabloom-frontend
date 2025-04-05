import { Handle, Position, NodeProps } from "@xyflow/react";

type IfElseNodeData = {
  label: string;
  onEdit?: () => void;
  data: any;
  id: string;
  position: { x: number; y: number };
};

const IfElseNode = ({ data }: NodeProps<IfElseNodeData>) => {
  return (
    <div
      className="bg-yellow-100 border-2 border-yellow-400 px-4 py-2 rounded-lg text-sm font-medium shadow-md cursor-pointer"
      onClick={data?.onEdit}
    >
      <div className="text-yellow-800">{data.label}</div>

      {/* Top input */}
      <Handle type="target" position={Position.Top} />

      {/* Output at bottom */}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default IfElseNode;
