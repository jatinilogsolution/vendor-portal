import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export const getVarianceIcon = (variance: number) => {
  if (variance > 0) return TrendingUp;
  if (variance < 0) return TrendingDown;
  return Minus;
};

export const getVarianceColor = (variance: number) => {
  if (variance > 0) return "text-green-500";
  if (variance < 0) return "text-destructive";
  return "text-muted-foreground";
};

export const formatCurrency = (amount: number) => {
  return `₹${amount?.toLocaleString()}`;
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};
