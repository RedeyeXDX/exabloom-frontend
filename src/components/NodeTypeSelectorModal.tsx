import React from "react";

type Props = {
  onSelect: (type: "action" | "ifelse") => void;
  onClose: () => void;
  position: { x: number; y: number };
};

const NodeTypeSelectorModal: React.FC<Props> = ({
  onSelect,
  onClose,
  position,
}) => {
  return (
    <div
      className="absolute bg-white shadow-lg rounded-md p-3 z-50"
      style={{ top: position.y, left: position.x }}
    >
      <p className="text-sm font-semibold mb-2">Select Node Type:</p>
      <button
        onClick={() => {
          onSelect("action");
          onClose();
        }}
        className="block w-full text-left px-3 py-1 hover:bg-gray-100 rounded"
      >
        ➕ Action Node
      </button>
      <button
        onClick={() => {
          onSelect("ifelse");
          onClose();
        }}
        className="block w-full text-left px-3 py-1 hover:bg-gray-100 rounded"
      >
        🔀 If/Else Node
      </button>
    </div>
  );
};

export default NodeTypeSelectorModal;
