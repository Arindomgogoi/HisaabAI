"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SIZE_SHORT } from "@/lib/constants";
import { formatDateTime } from "@/lib/formatters";
import { History } from "lucide-react";
import type { SizeUnit } from "@/generated/prisma";

interface Transfer {
  id: string;
  casesTransferred: number;
  bottlesGenerated: number;
  transferDate: Date;
  product: {
    name: string;
    size: SizeUnit;
  };
}

export function TransferHistory({ transfers }: { transfers: Transfer[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-base flex items-center gap-2">
          <History className="w-4 h-4" />
          Recent Transfers
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transfers.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No transfers yet
          </p>
        ) : (
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Cases</TableHead>
                  <TableHead className="text-right">Bottles</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transfers.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <span className="font-medium text-sm">
                        {t.product.name}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">
                        ({SIZE_SHORT[t.product.size]})
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {t.casesTransferred}
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium">
                      {t.bottlesGenerated}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDateTime(t.transferDate)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
