import {DataGrid} from '@mui/x-data-grid';
import {useContext, useEffect, useState} from "react";
import {getRequest} from "@/common/utils/RequestUtil.js";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";
import {Button, Stack, TextField} from "@mui/material";
import {Search} from "@mui/icons-material";
import columns from "./columns.jsx";

const LOCAL_STORAGE_KEY_PAGINATION = 'licenses_table_pagination';
const LOCAL_STORAGE_KEY_COLUMNS = 'licenses_table_columns';
const LOCAL_STORAGE_KEY_DISPLAYED_COLUMNS = 'licenses_table_displayed_columns';

export const Licenses = () => {
    const {currentProject} = useContext(ProjectContext);

    const [isLoading, setIsLoading] = useState(true);
    const [rows, setRows] = useState([]);
    const [paginationModel, setPaginationModel] = useState(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_PAGINATION))
        || {page: 1, pageSize: 25, rowCount: 0});

    const [columnSettings, setColumnSettings] = useState(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_COLUMNS)) || {});
    const [disabledColumns, setDisabledColumns] = useState(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_DISPLAYED_COLUMNS)) || []);

    const fetchLicenses = async () => {
        setIsLoading(true);
        try {
            const data = await getRequest(`/license/${currentProject.id}/list?limit=${paginationModel.pageSize}&page=${paginationModel.page}`);
            setRows(data?.licenses.map((license) => ({id: license.key, ...license})) || []);
            setPaginationModel(prev => ({...prev, rowCount: data.total}));
            setIsLoading(false);
        } catch (e) {
            console.error(e);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY_PAGINATION, JSON.stringify(paginationModel));
        fetchLicenses();
    }, [paginationModel.pageSize, paginationModel.page]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY_COLUMNS, JSON.stringify(columnSettings));
    }, [columnSettings]);

    const handlePaginationModelChange = (model) => setPaginationModel(prev => ({...prev, page: model.page,
        pageSize: model.pageSize}));

    const handleColumnWidthChange = (params) => setColumnSettings((prev) => ({...prev,
        [params.colDef.field]: params.width}));

    const getColumnsWithWidth = () => columns.map(column => ({...column,
        width: columnSettings[column.field] || column.width}));

    const updateDisplayedColumns = (columns) => {
        const newColumns = Object.keys(columns).filter(column => !columns[column]);
        setDisabledColumns(newColumns);
        localStorage.setItem(LOCAL_STORAGE_KEY_DISPLAYED_COLUMNS, JSON.stringify(newColumns));
    }

    return (
        <Stack>

            <Stack justifyContent="space-between" direction="row" sx={{mb: 2}} alignItems="center">
                <TextField variant="outlined" size="small" placeholder="Lookup license"
                           InputProps={{startAdornment: <Search sx={{mr: 1}}/>}}/>
                <Button variant="contained" color="primary">Create license</Button>
            </Stack>

            <DataGrid rows={rows} columns={getColumnsWithWidth()} loading={isLoading} paginationMode="server"
                      paginationModel={paginationModel} onPaginationModelChange={handlePaginationModelChange}
                      rowCount={paginationModel.rowCount} autoHeight disableColumnFilter disableColumnSorting
                      sx={{display: 'grid', gridTemplateRows: 'auto 1fr auto'}} pageSizeOptions={[10, 25, 50]}
                      columnVisibilityModel={disabledColumns.reduce((acc, column) => ({...acc, [column]: false}), {})}
                      onColumnVisibilityModelChange={updateDisplayedColumns}
                      onColumnWidthChange={handleColumnWidthChange}/>
        </Stack>
    );
}