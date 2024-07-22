import {IconButton, Stack} from "@mui/material";
import {Delete, Edit, Key} from "@mui/icons-material";

export default [
    {
        field: 'key', headerName: 'License key', width: 250, renderCell: (params) => <Stack direction="row" gap={1}
                                                                                            alignItems="center">
            <Key/>{params.value}
        </Stack>
    },
    {field: 'groups', headerName: 'Groups', width: 200, renderCell: (params) =>
            params.value.length > 0 ? params.value.join(', ') : "-"},
    {field: 'permissions', headerName: 'Permissions', width: 200, renderCell: (params) =>
            params.value.length > 0 ? params.value.join(', ') : "-"},
    {field: 'currentUses', headerName: 'Current uses', width: 180},
    {
        field: 'maxUses', headerName: 'Maximum uses', width: 180, renderCell: (params) =>
            params.value === -1 ? "Unlimited" : params.value
    },
    {
        field: 'expirationDate', headerName: 'Expiration date', width: 200, renderCell: (params) =>
            new Date(params.value).getTime() === 0 ? "Never" : new Date(params.value).toLocaleString()
    },
    {
        field: 'actions', headerName: 'Actions', width: 80, renderCell: () => <Stack direction="row" gap={1}
                                                                                     height="100%" alignItems="center">
            <IconButton size="small" color="primary"><Edit/></IconButton>
            <IconButton size="small" color="error"><Delete/></IconButton>
        </Stack>, sortable: false, filterable: false, align: 'center'
    }
];