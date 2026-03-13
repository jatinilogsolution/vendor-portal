"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Category = {
  id: string;
  name: string;
};

type Item = {
  id: string;
  code: string;
  name: string;
  uom: string;
  defaultPrice: number;
  hsnCode?: string | null;
  description?: string | null;
  category?: Category | null;
};

export default function ItemMasterPage({
  items,
  categories,
  onCreate,
  onImport,
}: {
  items: Item[];
  categories: Category[];
  onCreate: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
  onImport: (formData: FormData) => Promise<{ error?: string; success?: boolean; inserted?: number; errors?: string[] }>;
}) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    if (!search) return items;
    const term = search.toLowerCase();
    return items.filter((item) => {
      return (
        item.code.toLowerCase().includes(term) ||
        item.name.toLowerCase().includes(term) ||
        (item.hsnCode || "").toLowerCase().includes(term)
      );
    });
  }, [items, search]);

  const handleCreate = async (formData: FormData) => {
    setErrorMessage(null);
    const res = await onCreate(formData);
    if (res?.error) setErrorMessage(res.error);
  };

  const handleImport = async (formData: FormData) => {
    setImportMessage(null);
    const res = await onImport(formData);
    if (res?.error) {
      setImportMessage(res.error);
      return;
    }
    if (res?.success) {
      const info = [`Imported ${res.inserted ?? 0} items.`];
      if (res.errors && res.errors.length) {
        info.push(`${res.errors.length} rows skipped.`);
      }
      setImportMessage(info.join(" "));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Item</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage ? (
            <div className="text-sm text-destructive">{errorMessage}</div>
          ) : null}
          <form action={handleCreate} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Item Code</label>
              <Input name="code" placeholder="ITEM-001" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input name="name" placeholder="Item name" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">UOM</label>
              <Input name="uom" placeholder="Unit of measure" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Price</label>
              <Input name="defaultPrice" type="number" step="0.01" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">HSN/SAC Code</label>
              <Input name="hsnCode" placeholder="HSN/SAC" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select name="categoryId">
                <SelectTrigger>
                  <SelectValue placeholder="Assign category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Unassigned</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Description</label>
              <Input name="description" placeholder="Optional description" />
            </div>
            <div className="flex items-end">
              <Button type="submit">Create Item</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Import Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {importMessage ? (
            <div className="text-sm text-muted-foreground">{importMessage}</div>
          ) : null}
          <form action={handleImport} className="flex flex-col gap-3">
            <Input
              type="file"
              name="file"
              accept=".xlsx,.xls,.csv"
              required
            />
            <div className="text-xs text-muted-foreground">
              Columns supported: code, name, uom, default_price, hsn_code,
              description, category (name) or category_id.
            </div>
            <Button type="submit" variant="secondary">
              Import Items
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Item Master</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 pb-4">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search items..."
            />
            <Badge variant="secondary">{filteredItems.length} items</Badge>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>UOM</TableHead>
                <TableHead>Default Price</TableHead>
                <TableHead>HSN/SAC</TableHead>
                <TableHead>Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No items found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.code}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.uom}</TableCell>
                    <TableCell>{item.defaultPrice.toFixed(2)}</TableCell>
                    <TableCell>{item.hsnCode || "—"}</TableCell>
                    <TableCell>{item.category?.name || "Unassigned"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
