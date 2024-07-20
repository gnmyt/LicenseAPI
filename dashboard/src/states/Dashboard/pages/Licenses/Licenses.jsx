import {DataGrid} from '@mui/x-data-grid';
import {useContext, useEffect, useState} from "react";
import {getRequest} from "@/common/utils/RequestUtil.js";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";
import {Button, Stack, TextField} from "@mui/material";
import {Search} from "@mui/icons-material";
import columns from "./columns.jsx";

export const Licenses = () => {
    const {currentProject} = useContext(ProjectContext);

    const [isLoading, setIsLoading] = useState(true);
    const [rows, setRows] = useState([]);
    const [pageInfo, setPageInfo] = useState({totalRowCount: 0, totalPages: 0, pageSize: 100, page: 0});

    const fetchLicenses = async () => {
        setIsLoading(true);
        try {
            const data = await getRequest(`/license/${currentProject.id}/list?limit=${pageInfo.pageSize}&page=${pageInfo.page}`);

            setRows(data?.licenses.map((license) => ({id: license.key, ...license})) || []);
            setPageInfo(pageInfo => ({totalRowCount: data.total, totalPages: Math.ceil(data.total / pageInfo.pageSize),
                pageSize: pageInfo.pageSize, page: pageInfo.page}));
            setIsLoading(false);
        } catch (e) {
            console.error(e);
        }
    }

    const onPageChange = async (page) => setPageInfo({...pageInfo, page: page});

    useEffect(() => {
        fetchLicenses();
    }, [pageInfo.page]);

    return (
        <Stack>

            <Stack justifyContent="space-between" direction="row" sx={{mb: 2}} alignItems="center">
                <TextField variant="outlined" size="small" placeholder="Lookup license"
                           InputProps={{startAdornment: <Search sx={{mr: 1}} />}}/>
                <Button variant="contained" color="primary">Create license</Button>
            </Stack>

            <DataGrid rows={rows} columns={columns} loading={isLoading} paginationMode="server" disableSelectionOnClick
                      rowCount={pageInfo.totalRowCount} paginationModel={pageInfo} autoHeight disableColumnFilter
                      onPaginationModelChange={(page) => onPageChange(page.page)} disableColumnMenu
                      sx={{display: 'grid', gridTemplateRows: 'auto 1f auto'}} />
        </Stack>
    );
}