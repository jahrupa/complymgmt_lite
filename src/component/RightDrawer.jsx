import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';

export default function RightDrawer({ drawerHeader, drawerBody, drawerFilePreviewHeader ,drawerFilePreviewBody}) {
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const DrawerList = (
        <Box sx={{ width: 650 }} role="presentation">
            {drawerHeader()}
            <Divider />
            <List>
                {drawerBody()}
            </List>
            {drawerFilePreviewHeader()}
            <Divider />
            <List>
                {drawerFilePreviewBody()}
            </List>
        </Box>
    );

    return (
        <div>
            <Button onClick={toggleDrawer(true)}>Open drawer</Button>
            <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    );
}
