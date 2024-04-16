"use client";
import Table from "./Table";
import React, { useState, useRef, useEffect } from "react";
import {
  Checkbox,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { CiMenuKebab } from "react-icons/ci";
const Test = () => {
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { id: "stt", label: "STT" },
    { id: "option2", label: "Option 2" },
    { id: "option3", label: "Option 3" },
  ];
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);
  const handleCheck = (optionId) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(optionId)) {
        newSet.delete(optionId);
      } else {
        newSet.add(optionId);
      }
      return newSet;
    });
  };

  const toggleDropdown = () => setIsOpen(!isOpen);
  console.log(selectedItems);
  return (
    <>
      {/* <div ref={dropdownRef}>
        <DropdownTrigger
          as={Button}
          auto
          flat
          color="primary"
          iconRight={<CiMenuKebab />}
          onClick={toggleDropdown}
        >
          Select Options
        </DropdownTrigger>
        
        <DropdownMenu color="primary" aria-label="Multiple selection example">
          {options.map((option) => (
            <DropdownItem key={option.id}>
              <Checkbox
                checked={selectedItems.has(option.id)}
                onChange={() => handleCheck(option.id)}
              >
                {option.label}
              </Checkbox>
            </DropdownItem>
          ))}
        </DropdownMenu>
       
      </div> */}
      <Table />
    </>
  );
};

export default Test;
