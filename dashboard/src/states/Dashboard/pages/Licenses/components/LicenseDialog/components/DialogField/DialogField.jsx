import {Stack, Typography} from "@mui/material";
import {ChevronRight} from "@mui/icons-material";

export const DialogField = ({icon, title, description, onClick}) => {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center"
                onClick={onClick} sx={{border: 1, borderColor: 'divider', borderRadius: 1.5, p: 1.5, cursor: "pointer"}}>
            <Stack direction="row" alignItems="center" gap={2}>
                {icon}
                <Stack direction="column">
                    <Typography variant="h6" fontWeight={600}>{title}</Typography>
                    <Typography variant="body2" color="text.secondary"
                                sx={{maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                        {description}
                    </Typography>
                </Stack>
            </Stack>
            <ChevronRight/>
        </Stack>
    )
}