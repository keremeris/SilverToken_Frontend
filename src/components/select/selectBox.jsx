import React, { useState } from "react";
import Select from "react-select";
import CheckIcon from "../../assets/images/checkIcon.svg";

const optionClassNames = (state) => {
  return state.isSelected
    ? "!bg-primitives-50 checked !font-mainMedium !text-textPrimary !text-sm"
    : "!font-mainRegular !text-sm !text-textPrimary !bg-white hover:!bg-primitives-50";
};
const menuClassNames = (state) => {
  return "!bg-surfacePrimary !min-w-[148px] !right-0 !border !border-gray-300 !rounded-lg !shadow-none !overflow-hidden";
};
const menuListClassNames = () => {
  return "!p-0";
};
const customIndicatorSeparator = () => {
  return "!hidden";
};

const customPlaceholder = () => {
  return "!text-textPrimary !text-sm";
};

export function SelectBox({
  options,
  selected,
  placeholder,
  rounded,
  onChange,
  onExchangeFilterChange,
}) {
  const controlClassNames = () => {
    return `${
      rounded ? "!rounded-full" : "!rounded-lg"
    } !border !border-gray-300 !bg-surfacePrimary !cursor-pointer`;
  };
  const handleChange = (selectedOption) => {
    if (onChange) {
      onChange(selectedOption);
    }
    if (onExchangeFilterChange) {
      onExchangeFilterChange(selectedOption);
    }
  };

  return (
    <Select
      options={options}
      defaultValue={selected ? selected : false}
      value={selected ? selected : false}
      isSearchable={false}
      placeholder={placeholder ? placeholder : "select"}
      onChange={handleChange}
      classNames={{
        control: controlClassNames,
        option: optionClassNames,
        menu: menuClassNames,
        menuList: menuListClassNames,
        indicatorSeparator: customIndicatorSeparator,
        placeholder: customPlaceholder,
      }}
      formatOptionLabel={(option) => (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={option.labelImage}
              alt="country-image"
              className="w-full max-w-[18px]"
            />
            <span className={option.isDisabled ?  "text-sm text-gray-400" : "text-sm text-black-500"}>{option.label}</span>
          </div>
          <img className="hidden select-check-icon" src={CheckIcon} alt="" />
        </div>
      )}
    />
  );
}
