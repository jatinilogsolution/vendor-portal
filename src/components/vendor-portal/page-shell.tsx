import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Empty, EmptyMedia } from "@/components/ui/empty";
import { FileText } from "lucide-react";

interface VendorPortalPageShellProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function VendorPortalPageShell({
  title,
  description,
  children,
}: VendorPortalPageShellProps) {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </header>
      {children}
    </div>
  );
}

export function VendorPortalPlaceholder({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items?: string[];
}) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {items && items.length > 0 ? (
          <ul className="space-y-2 text-sm text-muted-foreground">
            {items.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <Empty className="border-0 bg-transparent p-0">
            <EmptyMedia variant="icon" className="mb-0">
              <FileText className="size-5 text-muted-foreground" />
            </EmptyMedia>
          </Empty>
        )}
      </CardContent>
    </Card>
  );
}
