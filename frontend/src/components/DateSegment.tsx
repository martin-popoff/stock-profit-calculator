import { useRef } from "react";
import { useDateSegment } from "@react-aria/datepicker";

const DateSegment = ({ segment, state }: any) => {
  const ref = useRef(null);
  const { segmentProps } = useDateSegment(segment, state, ref);

  return (
    <div
      {...segmentProps}
      ref={ref}
      className={`group box-content rounded-sm px-0.5 text-right text-lg tabular-nums outline-none focus:bg-neutral-100 focus:text-neutral-900 ${
        !segment.isEditable ? "text-neutral-500" : "text-neutral-100"
      }`}
    >
      <span
        aria-hidden="true"
        className="block w-full text-center italic text-gray-500 group-focus:text-white"
        style={{
          visibility: segment.isPlaceholder ? "visible" : "hidden",
          height: segment.isPlaceholder ? 0 : 0,
          pointerEvents: "none",
        }}
      >
        {segment.placeholder}
      </span>
      {segment.isPlaceholder ? "" : segment.text}
    </div>
  );
};

export default DateSegment;
