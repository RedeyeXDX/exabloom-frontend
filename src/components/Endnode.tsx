//end node function
import { Handle, Position } from "@xyflow/react";

const EndNode = () => {
  return (
    <div className="bg-pink-100 text-black font-semibold px-4 py-2 rounded-md shadow-md text-sm">
      <Handle type="target" position={Position.Top} />
      <strong>End</strong>
    </div>
  );
};

export default EndNode;
