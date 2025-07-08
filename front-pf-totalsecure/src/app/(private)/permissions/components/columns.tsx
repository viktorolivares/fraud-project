import { Permission } from "@/types/permission";
import { type ColumnDef } from "@tanstack/react-table";
import { PermissionActionsCell } from "./permission-actions-cell";
import { KeyRound } from "lucide-react";

export type { Permission };

export const columns = (options?: { onPermissionUpdated?: () => void; onPermissionDeleted?: () => void }): ColumnDef<Permission>[] => [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "name",
		header: "Nombre",
		cell: ({ row }) => (
			<span className="flex items-center gap-2 text-primary font-bold">
				<KeyRound size={18} className="text-primary" />
				{row.original.name}
			</span>
		),
	},
	{
		accessorKey: "description",
		header: "Descripción",
	},
	{
		accessorKey: "moduleId",
		header: "ID Módulo",
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
			<PermissionActionsCell
				permission={row.original}
				onPermissionUpdated={options?.onPermissionUpdated}
				onPermissionDeleted={options?.onPermissionDeleted}
			/>
		),
	},
];
