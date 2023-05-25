import type { ComboBoxProps } from "@react-types/combobox";
import { useComboBoxState } from "react-stately";
import { useComboBox, useFilter, useButton } from "react-aria";
import Popover from "./Popover";
import List from "./List";
import { useRef } from "react";

export { Item, Section } from "react-stately";

const Pick = <T extends object>(props: ComboBoxProps<T>) => {
  const { contains } = useFilter({ sensitivity: "base" });
  const state = useComboBoxState({ ...props, defaultFilter: contains });

  const buttonRef = useRef(null);
  const inputRef = useRef(null);
  const listBoxRef = useRef(null);
  const popoverRef = useRef(null);

  const {
    buttonProps: triggerProps,
    inputProps,
    listBoxProps,
    labelProps,
  } = useComboBox(
    {
      ...props,
      inputRef,
      buttonRef,
      listBoxRef,
      popoverRef,
    },
    state
  );

  const { buttonProps } = useButton(triggerProps, buttonRef);

  return (
    <div className="relative w-80">
      <label {...labelProps} className="hidden">
        {props.label}
      </label>
      <div
        className={`relative flex flex-row overflow-hidden border-2 transition-colors ${
          state.isFocused ? "border-neutral-100" : "border-neutral-500"
        }`}
      >
        <input
          {...inputProps}
          ref={inputRef}
          className="w-full bg-neutral-900 px-4 py-3 text-lg outline-none"
        />
        <button
          {...buttonProps}
          ref={buttonRef}
          className={` px-5 text-xl transition-colors   ${
            state.isOpen
              ? "bg-neutral-100 text-neutral-900  hover:bg-neutral-300"
              : "bg-neutral-500 text-neutral-100 hover:bg-neutral-600"
          }`}
        >
          <i
            className={`fa-solid fa-caret-down transition-transform ${
              state.isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
      {state.isOpen && (
        <Popover
          popoverRef={popoverRef}
          triggerRef={inputRef}
          state={state}
          isNonModal
          placement="bottom start"
          className="w-80"
        >
          <List {...listBoxProps} listBoxRef={listBoxRef} state={state} />
        </Popover>
      )}
    </div>
  );
};

export default Pick;
