import React, { useState, useEffect } from "react";
import type { Node } from "@xyflow/react";

type NodeData = {
  label: string;
  Animation?: boolean;
};

type EditNodeModalProps = {
  node: Node<NodeData>;
  onSave: (updatedNode: Node<NodeData>) => void;
  onDelete: (nodeId: string) => void;
  onClose: () => void;
};

const EditNodeModal: React.FC<EditNodeModalProps> = ({
  node,
  onSave,
  onDelete,
  onClose,
}) => {
  const [label, setLabel] = useState(node.data.label);

  useEffect(() => {
    setLabel(node.data.label);
  }, [node]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Edit Action Node</h2>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Label
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring focus:border-blue-300"
          value={label}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setLabel(e.target.value)
          }
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-3 py-2 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
            onClick={() => {
              onDelete(node.id);
              onClose();
            }}
          >
            Delete
          </button>
          <button
            className="px-3 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white text-sm"
            onClick={() => {
              const updatedNode = {
                ...node,
                data: { ...node.data, label },
              };
              onSave(updatedNode);
              onClose();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditNodeModal;
