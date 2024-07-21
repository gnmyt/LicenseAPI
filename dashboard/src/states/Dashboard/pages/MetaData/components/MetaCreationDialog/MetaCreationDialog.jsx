import {
    Alert,
    Button, ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Stack, Switch,
    TextField, Typography
} from "@mui/material";
import {patchRequest, putRequest} from "@/common/utils/RequestUtil.js";
import {useContext, useEffect, useState} from "react";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";
import {Description, TextFields, ToggleOn, LooksOneRounded, TableChart, Public} from "@mui/icons-material";

export const MetaCreationDialog = ({open, onClose, fetchPermissions, editItem, setEditItem}) => {
    const {currentProject} = useContext(ProjectContext);

    const [type, setType] = useState("TEXT");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [defaultValue, setDefaultValue] = useState("");
    const [isPublic, setPublic] = useState(false);

    const [creationError, setCreationError] = useState("");

    const updateName = async (event) => {
        setCreationError("");
        setName(event.target.value);
    }

    const updateDescription = async (event) => {
        setCreationError("");
        setDescription(event.target.value);
    }

    const updateDefaultValue = async (event) => {
        setCreationError("");
        setDefaultValue(event.target.value);
    }

    const closeDialog = () => {
        onClose();

        setType("TEXT");
        setName("");
        setDescription("");
        setDefaultValue("");
        setPublic(false);

        setEditItem(null);
        setCreationError("");
    }

    const createMetaItem = async () => {
        try {
            await putRequest(`/meta/${currentProject.id}`, {
                name, type, description, defaultValue,
                public: isPublic
            });
            fetchPermissions();

            closeDialog();
        } catch (e) {
            setCreationError(e.message);
        }
    }

    const updateMetaItem = async () => {
        try {
            await patchRequest(`/meta/${currentProject.id}/${editItem.name}`, {
                name, description, defaultValue, public: isPublic
            });
            fetchPermissions();

            closeDialog();
        } catch (e) {
            setCreationError(e.message);
        }
    }

    useEffect(() => {
        if (!editItem) setDefaultValue(type === "BOOLEAN" ? "false" : type === "NUMBER" ? "0" : "-");
    }, [type]);

    useEffect(() => {
        if (editItem) {
            setType(editItem.type);
            setName(editItem.name);
            setDescription(editItem.description);
            setDefaultValue(editItem.defaultValue);
            setPublic(editItem.public);
        }
    }, [editItem]);

    const onKeyUp = (event) => {
        if (event.key === "Enter") {
            if (editItem) updateMetaItem();
            else createMetaItem();
        }
    }

    return (
        <Dialog open={open} onClose={closeDialog} onKeyUp={onKeyUp}>
            <DialogTitle>{editItem ? "Update" : "Create"} meta data</DialogTitle>
            <DialogContent sx={{maxWidth: 350}}>
                <Stack gap={1}>
                    {creationError && <Alert severity="error" sx={{mb: 1}}>{creationError}</Alert>}
                    {!editItem && <ButtonGroup fullWidth sx={{mb: 1}}>
                        <Button onClick={() => setType("BOOLEAN")}
                                variant={type === "BOOLEAN" ? "contained" : "outlined"}>
                            <ToggleOn/>
                            Boolean
                        </Button>
                        <Button onClick={() => setType("TEXT")} variant={type === "TEXT" ? "contained" : "outlined"}>
                            <TextFields/>
                            Text
                        </Button>
                        <Button onClick={() => setType("NUMBER")}
                                variant={type === "NUMBER" ? "contained" : "outlined"}>
                            <LooksOneRounded/>
                            Number
                        </Button>

                    </ButtonGroup>}

                    <TextField variant="outlined" fullWidth label="Name" value={name} onChange={updateName} sx={{my: 1}}
                                 placeholder="Name"
                               InputProps={{startAdornment: <TableChart sx={{color: "text.secondary", mr: 1}}/>}}/>
                    <TextField variant="outlined" fullWidth label="Description" value={description}
                               onChange={updateDescription} placeholder="Description"
                               sx={{mb: 1}}
                               InputProps={{startAdornment: <Description sx={{color: "text.secondary", mr: 1}}/>}}/>

                    {type === "TEXT" && <TextField variant="outlined" fullWidth label="Default value" value={defaultValue}
                                                   onChange={updateDefaultValue} sx={{mb: 1}}
                                                   placeholder="Default value"
                                                   InputProps={{
                                                       startAdornment: <TextFields
                                                           sx={{color: "text.secondary", mr: 1}}/>
                                                   }}/>}
                    {type === "NUMBER" && <TextField variant="outlined" fullWidth label="Default value"
                                                     value={defaultValue}
                                                     onChange={updateDefaultValue} sx={{mb: 1}} type="number"
                                                        placeholder="Default value"
                                                     InputProps={{
                                                         startAdornment: <LooksOneRounded
                                                             sx={{color: "text.secondary", mr: 1}}/>
                                                     }}/>}
                    {type === "BOOLEAN" &&
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{mx: 1}}>

                            <Stack direction="row" alignItems="center" gap={1}>
                                <ToggleOn/>
                                <Typography>Default state</Typography>
                            </Stack>

                            <Switch checked={defaultValue === "true"} onChange={(event) => setDefaultValue(String(event.target.checked))}/>
                        </Stack>}

                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{mx: 1}}>
                        <Stack direction="row" alignItems="center" gap={1}>
                            <Public/>
                            <Typography>Public</Typography>
                        </Stack>
                        <Switch checked={isPublic} onChange={(event) => setPublic(event.target.checked)}/>
                    </Stack>

                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog}>Cancel</Button>
                <Button onClick={editItem ? updateMetaItem : createMetaItem} color="primary">
                    {editItem ? "Update" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}