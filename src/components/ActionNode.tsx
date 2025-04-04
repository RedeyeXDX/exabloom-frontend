import { Handle, Position } from "@xyflow/react";

type Props = {
  data: {
    label: string;
    onEdit?: () => void;
    onDelete?: () => void;
  };
};

const ActionNode = ({ data }: Props) => {
  return (
    <div
      style={{
        padding: 10,
        background: "#bfdbfe",
        borderRadius: 8,
        position: "relative",
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div style={{ marginBottom: 5 }}>
        <strong>{data.label || "Action"}</strong>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {data.onEdit && <button onClick={data.onEdit}>✏️</button>}
        {data.onDelete && <button onClick={data.onDelete}>🗑️</button>}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default ActionNode;
