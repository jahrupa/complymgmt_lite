import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';

export default function RightDrawer({ pdfFile, isPdfView, toggleDrawer, drawerHeader, drawerBody, drawerFilePreviewHeader, drawerFilePreviewBody, isModalOpen }) {
    const DrawerList = (
        <Box sx={{ width: '500px' }} role="presentation">
            <div className='d-flex justify-content-between'>
                {drawerHeader()}
                <button onClick={toggleDrawer(false)} className='align-items-center d-flex pe-3 btn'>x</button>
            </div>


            <Divider />

            {isPdfView ? (
                <List>
                    {pdfFile()}
                </List>
            ) : <>
                <List>
                    {drawerBody()}
                </List>
                {drawerFilePreviewHeader()}
                <Divider />

                <List>
                    {drawerFilePreviewBody()}
                </List>
            </>}

        </Box>
    );

    return (
        <div>
            <Drawer anchor="right" open={isModalOpen} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    );
}
