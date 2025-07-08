import { Role } from "@/types/role";
import { type ColumnDef } from "@tanstack/react-table";
import { RoleActionsCell } from "./role-actions-cell";
import { ShieldCheck } from "lucide-react";

export type { Role };

export const columns = (options?: { onRoleUpdated?: () => void; onRoleDeleted?: () => void }): ColumnDef<Role>[] => [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "name",
		header: "Nombre",
		cell: ({ row }) => (
			<span className="flex items-center gap-2 text-primary font-bold">
				<ShieldCheck size={18} className="text-primary" />
				{row.original.name}
			</span>
		),
	},
	{
		accessorKey: "description",
		header: "Descripción",
	},
	{
		accessorKey: "createdAt",
		header: "Creado",
		cell: ({ getValue }) => new Date(getValue() as string).toLocaleString(),
	},
	{
		accessorKey: "updatedAt",
		header: "Actualizado",
		cell: ({ getValue }) => new Date(getValue() as string).toLocaleString(),
	},
	{
		id: "actions",
		header: "Acciones",
		cell: ({ row }) => (
			<RoleActionsCell
				role={row.original}
				onRoleUpdated={options?.onRoleUpdated}
				onRoleDeleted={options?.onRoleDeleted}
			/>
		),
	},
];
