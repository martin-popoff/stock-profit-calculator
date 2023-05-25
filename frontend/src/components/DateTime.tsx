import { useRef } from "react";
import { useLocale } from "@react-aria/i18n";
import { useDateFieldState } from "@react-stately/datepicker";
import { useDateField } from "@react-aria/datepicker";
import { createCalendar } from "@internationalized/date";
import DateSegment from "./DateSegment";

const DateTime = (props: any) => {
  const { locale } = useLocale();
  const state = useDateFieldState({
    ...props,
    locale,
    createCalendar,
  });

  const ref = useRef<HTMLDivElement>(null);
  const { labelProps, fieldProps } = useDateField(props, state, ref);

  return (
    <div className="flex flex-col items-start gap-2">
      <span {...labelProps} className="text-neutral-300">
        {props.label}
      </span>
      <div
        {...fieldProps}
        ref={ref}
        className="flex border-2 border-neutral-500 bg-neutral-900 p-1 px-4 py-3 transition-colors  focus-within:border-neutral-100"
      >
        {state.segments.map((segment, i) => (
          <DateSegment key={i} segment={segment} state={state} />
        ))}
      </div>
      <div className=""></div>
    </div>
  );
};

export default DateTime;
