import React from "react";

const Row = ({ label, children }: {
    label: string, children: React.ReactNode
}) => {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-200">
      <span className="text-sm text-gray-500">{label}</span>
      <div className="text-sm font-medium text-gray-900 text-right">
        {children}
      </div>
    </div>
  );
};

export default Row;