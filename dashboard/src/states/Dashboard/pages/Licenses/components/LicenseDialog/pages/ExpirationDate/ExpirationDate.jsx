import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {Button, Typography} from "@mui/material";
import {CalendarMonth} from "@mui/icons-material";

export const ExpirationDate = ({expirationDate, setExpirationDate, goBack}) => {

    const setInDays = (days) => {
        setAndGoBack(new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000).toISOString());
    }

    const setAndGoBack = (date) => {
        setExpirationDate(date);
        goBack();
    }

    return (
        <>
            <Typography variant="subtitle1" fontWeight={600}>New expiration date</Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                    value={new Date(expirationDate).getTime() === 0 ? null : new Date(expirationDate)}
                    onChange={(newValue) => {
                        console.log(JSON.stringify(newValue));
                        setExpirationDate(new Date(newValue).toISOString());
                    }}
                />
            </LocalizationProvider>
            <Typography variant="subtitle1" fontWeight={600}>Expires in...</Typography>

            <Button variant="outlined" color="primary" sx={{mt: 1}} onClick={() => setAndGoBack(new Date(0))}
                    startIcon={<CalendarMonth/>}>
                Never
            </Button>

            <Button variant="outlined" color="primary" sx={{mt: 1}} onClick={() => setInDays(7)}
                    startIcon={<CalendarMonth/>}>
                In 7 days
            </Button>

            <Button variant="outlined" color="primary" sx={{mt: 1}} onClick={() => setInDays(30)}
                    startIcon={<CalendarMonth/>}>
                In 30 days
            </Button>

            <Button variant="outlined" color="primary" sx={{mt: 1}} onClick={() => setInDays(365)}
                    startIcon={<CalendarMonth/>}>
                In 1 year
            </Button>

        </>
    )
}