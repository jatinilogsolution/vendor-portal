import React from "react";

const Row = ({ label, children }: {
    label: string, children: React.ReactNode
}) => {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border">
      <span className="text-sm text-primary">{label}</span>
      <div className="text-sm font-medium text-foreground text-right">
        {children}
      </div>
    </div>
  );
};

export default Row;