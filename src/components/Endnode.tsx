//end node function
import { Handle, Position } from "reactflow";

const EndNode = () => {
  return (
    <div style={{ padding: 10, background: "#fee2e2", borderRadius: 8 }}>
      <Handle type="target" position={Position.Top} />
      <strong>End</strong>
    </div>
  );
};

export default EndNode;
