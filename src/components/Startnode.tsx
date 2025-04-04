import { Handle, Position } from "@xyflow/react";

const StartNode = () => {
  return (
    <div className="bg-green-100 text-black font-semibold px-4 py-2 rounded-md shadow-md text-sm">
      Start
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-green-600"
      />
    </div>
  );
};

export default StartNode;
