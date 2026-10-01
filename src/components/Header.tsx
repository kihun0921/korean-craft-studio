"use client";

import { useRef, type KeyboardEvent } from "react";

type TabKey = "products" | "classes";

interface HeaderProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const TABS: ReadonlyArray<{ key: TabKey; label: string }> = [
  { key: "products", label: "공예품 전시·주문" },
  { key: "classes", label: "공방 클래스" },
];

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusTab = (index: number) => {
    const next = TABS[index];
    tabRefs.current[index]?.focus();
    onTabChange(next.key);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = TABS.length - 1;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        focusTab(index === last ? 0 : index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        focusTab(index === 0 ? last : index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusTab(0);
        break;
      case "End":
        event.preventDefault();
        focusTab(last);
        break;
    }
  };

  return (
    <header className="bg-[#F8F5EF]">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <p className="text-xl font-semibold tracking-[0.2em] text-[#211F1C] sm:text-2xl">
          온결 공방
        </p>
      </div>

      <div className="border-t border-b border-[#E4DCC9]">
        <div
          role="tablist"
          aria-label="주요 메뉴"
          className="mx-auto flex max-w-6xl px-4 sm:px-6 lg:px-8"
        >
          {TABS.map((tab, index) => {
            const selected = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${tab.key}`}
                aria-selected={selected}
                aria-controls={`panel-${tab.key}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => onTabChange(tab.key)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#95704F] sm:px-5 sm:text-base ${
                  selected
                    ? "border-[#B08968] font-bold text-[#211F1C]"
                    : "border-transparent font-normal text-[#5B564C] hover:border-[#E4DCC9] hover:text-[#211F1C]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
