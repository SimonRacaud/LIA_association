import { Box, Container, IconButton, Tab, Tabs, Typography } from "@mui/material"
import { useState } from "react";
import UserTabPanel from "./UserTabPanel";
import BackIcon from '@mui/icons-material/Home'
import { useNavigate } from "react-router-dom";
import TemplateTabPanel from "./TemplateTabPanel";
import { tabPanelA11yProps } from "components/CustomTabPanel";

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
                <Tab label="Utilisateurs" {...tabPanelA11yProps(0)} />
                <Tab label="Modèles d'équipe" {...tabPanelA11yProps(1)} />
            </Tabs>
            <UserTabPanel tabIndex={tabIndex} />
            <TemplateTabPanel tabIndex={tabIndex} />
        </Container>
    )
}