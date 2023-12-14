import { Box, Container, IconButton, Tab, Tabs, Typography } from "@mui/material"
import { useState } from "react";
import UserTabPanel from "./UserTabPanel";
import BackIcon from '@mui/icons-material/Home'
import { useNavigate } from "react-router-dom";

function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
}

export interface CustomTabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }
export function CustomTabPanel(props: CustomTabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        >
        {value === index && (
            <Box sx={{ p: 2 }}>
                {children}
            </Box>
        )}
        </div>
    );
}

export type TabPanelProps = {
    tabIndex: number
}

export default function Settings()
{
    const [tabIndex, setTabIndex] = useState(0);
    const navigate = useNavigate()

    const handleChange = (e: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <Container component='main'>
            <Container sx={{
                display: 'flex',
                alignItems: 'center'
            }}>
                <IconButton size='large' onClick={() => navigate('/')} sx={{ mr: 1, height: 50 }}>
                    <BackIcon />
                </IconButton>
                <Typography variant="h4" sx={{ my: 2 }}>Paramètres d'administration</Typography>
            </Container>
            <Tabs value={tabIndex} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Utilisateurs" {...a11yProps(0)} />
                <Tab label="Modèles d'équipe" {...a11yProps(1)} />
            </Tabs>
            <UserTabPanel tabIndex={tabIndex} />
            <CustomTabPanel value={tabIndex} index={1}>
                Template CRUD
            </CustomTabPanel>
        </Container>
    )
}