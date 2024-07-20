import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#F15732',
            dark: '#D13C0F',
        },

        text: {
            main: '#000000',
            secondary: '#4F5660',
        },
        background: {
            default: '#FDFDFD',
        }
    },
    typography: {
        fontFamily: ["Inter", "sans-serif",].join(",")
    },
    shape: {
        borderRadius: 7,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    lineHeight: '1.5rem',
                    '&.MuiButton-containedPrimary': {
                        background: 'linear-gradient(45deg, #FF0401 0%, #FE6E27 100%)',
                    }
                }
            }
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontSize: '1rem',
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    borderBottom: '1px solid #E5E5E5',
                }
            }
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    paddingTop: 4,
                    paddingBottom: 4,
                }
            }
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    color: '#4F5660',
                    borderRadius: 10,
                    'svg': {
                        fontSize: '2rem',
                    },
                    '&.Mui-selected': {
                        background: 'linear-gradient(90deg, #FF0401 0%, #FE6E27 100%)',
                        color: '#FFFFFF',
                        fontWeight: 900,
                        '& svg': {
                            color: '#FFFFFF'
                        },
                    },
                    '&.Mui-selected:hover': {
                        color: '#FFFFFF'
                    }
                }
            }
        },
        MuiListItemText: {
            styleOverrides: {
                root: {
                    '& .MuiTypography-root': {
                        fontSize: '1rem',
                        fontWeight: 700
                    },
                }
            }
        }
    }
});

export default theme;