// src/components/Layout/Sidebar.tsx
import React from "react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sections = [
  "Overview",
  "Inventory",
  "Orders",
  "Customers",
  "Marketing",
  "Analytics",
  "Billing",
  "Settings",
  "Help"
];

const DashboardSidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          {sections.map((section) => (
            <li
              key={section}
              className={section === activeSection ? "active" : ""}
              onClick={() => onSectionChange(section)}
            >
              {section}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
