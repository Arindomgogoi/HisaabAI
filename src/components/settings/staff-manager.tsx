"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { addStaff, removeStaff, updateStaffRole } from "@/app/(app)/settings/staff/actions";
import { Loader2, Plus, Trash2, UserCog } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface StaffMember {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
}

const ROLE_STYLES: Record<string, string> = {
  OWNER:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  MANAGER:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  STAFF:
    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

export function StaffManager({
  staff: initialStaff,
  currentUserId,
  isOwner,
}: {
  staff: StaffMember[];
  currentUserId: string;
  isOwner: boolean;
}) {
  const [staff, setStaff] = useState(initialStaff);
  const [addOpen, setAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Add staff form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"MANAGER" | "STAFF">("STAFF");

  async function handleAdd() {
    setLoading(true);
    const result = await addStaff({ name, email, password, role });
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Staff account created");
      setAddOpen(false);
      setName(""); setEmail(""); setPassword(""); setRole("STAFF");
      // Refresh: reload to get updated list
      window.location.reload();
    }
  }

  async function handleRoleChange(userId: string, newRole: "MANAGER" | "STAFF") {
    setUpdatingId(userId);
    const result = await updateStaffRole(userId, newRole);
    setUpdatingId(null);
    if (result.error) {
      toast.error(result.error);
    } else {
      setStaff((prev) =>
        prev.map((s) => (s.id === userId ? { ...s, role: newRole } : s))
      );
      toast.success("Role updated");
    }
  }

  async function handleRemove(userId: string) {
    setRemovingId(userId);
    const result = await removeStaff(userId);
    setRemovingId(null);
    if (result.error) {
      toast.error(result.error);
    } else {
      setStaff((prev) => prev.filter((s) => s.id !== userId));
      toast.success("Staff member removed");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-semibold text-lg">Staff Accounts</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {staff.length} user{staff.length !== 1 ? "s" : ""} have access
          </p>
        </div>
        {isOwner && (
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Create Staff Account</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="space-y-1.5">
                  <Label>Full Name</Label>
                  <Input
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="rahul@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Temporary Password</Label>
                  <Input
                    type="password"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Role</Label>
                  <Select
                    value={role}
                    onValueChange={(v) => setRole(v as "MANAGER" | "STAFF")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MANAGER">Manager — full access</SelectItem>
                      <SelectItem value="STAFF">Staff — sales only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" size="sm">Cancel</Button>
                </DialogClose>
                <Button
                  size="sm"
                  onClick={handleAdd}
                  disabled={loading || !name || !email || !password}
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  {loading && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
                  Create Account
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden sm:table-cell">Joined</TableHead>
              {isOwner && <TableHead className="w-24"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium text-sm">
                  {s.name ?? "—"}
                  {s.id === currentUserId && (
                    <span className="ml-1.5 text-xs text-muted-foreground">(you)</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {s.email}
                </TableCell>
                <TableCell>
                  {isOwner && s.role !== "OWNER" && s.id !== currentUserId ? (
                    <Select
                      value={s.role}
                      onValueChange={(v) =>
                        handleRoleChange(s.id, v as "MANAGER" | "STAFF")
                      }
                      disabled={updatingId === s.id}
                    >
                      <SelectTrigger className="h-7 w-28 text-xs">
                        {updatingId === s.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <SelectValue />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MANAGER">Manager</SelectItem>
                        <SelectItem value="STAFF">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge
                      className={
                        ROLE_STYLES[s.role] ?? ROLE_STYLES.STAFF
                      }
                      variant="secondary"
                    >
                      {s.role}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                  {format(new Date(s.createdAt), "dd MMM yyyy")}
                </TableCell>
                {isOwner && (
                  <TableCell>
                    {s.role !== "OWNER" && s.id !== currentUserId && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-red-600"
                        onClick={() => handleRemove(s.id)}
                        disabled={removingId === s.id}
                      >
                        {removingId === s.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {!isOwner && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
          <UserCog className="w-4 h-4 shrink-0" />
          Only the shop owner can add or remove staff.
        </div>
      )}
    </div>
  );
}
