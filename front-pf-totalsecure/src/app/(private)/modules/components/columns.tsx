import { Module } from "@/types/module";
import { type ColumnDef } from "@tanstack/react-table";
import { ModuleActionsCell } from "./module-actions-cell";
import { LayoutGrid } from "lucide-react";

export type { Module };

export const columns = (options?: { onModuleUpdated?: () => void; onModuleDeleted?: () => void }): ColumnDef<Module>[] => [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "name",
		header: "Nombre",
		cell: ({ row }) => (
			<span className="flex items-center gap-2 text-primary font-bold">
				<LayoutGrid size={18} className="text-primary" />
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
			<ModuleActionsCell
				module={row.original}
				onModuleUpdated={options?.onModuleUpdated}
				onModuleDeleted={options?.onModuleDeleted}
			/>
		),
	},
];
