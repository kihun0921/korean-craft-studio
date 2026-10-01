"use client";

import { useRef, useState } from "react";
import { craftClasses } from "@/mocks/classes";
import type { CraftClass } from "@/types";
import ClassCard from "./ClassCard";
import ClassApplicationModal from "./ClassApplicationModal";

interface ClassGridProps {
  classes?: CraftClass[];
}

export default function ClassGrid({ classes = craftClasses }: ClassGridProps) {
  const [selectedClass, setSelectedClass] = useState<CraftClass | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const handleApply = (craftClass: CraftClass, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setSelectedClass(craftClass);
  };

  const handleClose = () => {
    setSelectedClass(null);
    const trigger = triggerRef.current;
    requestAnimationFrame(() => trigger?.focus());
  };

  return (
    <>
      <ul className="grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((craftClass) => (
          <li key={craftClass.id}>
            <ClassCard craftClass={craftClass} onApply={handleApply} />
          </li>
        ))}
      </ul>
      {selectedClass && (
        <ClassApplicationModal
          key={selectedClass.id}
          craftClass={selectedClass}
          onClose={handleClose}
        />
      )}
    </>
  );
}
