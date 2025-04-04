import { getBezierPath } from "@xyflow/react";

const foreignObjectSize = 40;

const AddEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
  data,
}: any) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={labelX - foreignObjectSize / 2}
        y={labelY - foreignObjectSize / 2}
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div
          className="w-full h-full flex items-center justify-center rounded-full shadow-lg text-xl font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
          onClick={data?.onAdd}
        >
          +
        </div>
      </foreignObject>
    </>
  );
};

export default AddEdge;
