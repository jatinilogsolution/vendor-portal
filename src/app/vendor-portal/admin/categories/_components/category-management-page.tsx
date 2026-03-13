"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Category = {
  id: string;
  name: string;
  code?: string | null;
  status: string;
  parent?: { id: string; name: string } | null;
};

export default function CategoryManagementPage({
  categories,
  onCreate,
  onUpdate,
}: {
  categories: Category[];
  onCreate: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
  onUpdate: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
}) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCreate = async (formData: FormData) => {
    setErrorMessage(null);
    const res = await onCreate(formData);
    if (res?.error) setErrorMessage(res.error);
  };

  const handleUpdate = async (formData: FormData) => {
    setErrorMessage(null);
    const res = await onUpdate(formData);
    if (res?.error) setErrorMessage(res.error);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage ? (
            <div className="text-sm text-destructive">{errorMessage}</div>
          ) : null}
          <form action={handleCreate} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input name="name" placeholder="Category name" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Code</label>
              <Input name="code" placeholder="Optional code" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Parent Category</label>
              <Select name="parentId">
                <SelectTrigger>
                  <SelectValue placeholder="Top level" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectLabel>Top level</SelectLabel> */}
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button type="submit">Create</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No categories created yet.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="font-medium">{cat.name}</TableCell>
                    <TableCell>{cat.code || "—"}</TableCell>
                    <TableCell>{cat.parent?.name || "Top level"}</TableCell>
                    <TableCell>
                      <Badge variant={cat.status === "ACTIVE" ? "default" : "secondary"}>
                        {cat.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <form action={handleUpdate} className="flex items-center gap-2">
                        <input type="hidden" name="categoryId" value={cat.id} />
                        <Select name="status" defaultValue={cat.status}>
                          <SelectTrigger className="h-8 w-35">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                            <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                            <SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button type="submit" size="sm" variant="secondary">
                          Update
                        </Button>
                      </form>
                    </TableCell>
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
