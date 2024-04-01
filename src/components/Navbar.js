import React from 'react';
import { Link } from 'react-router-dom'; // Make sure to install react-router-dom
import { Box, AppBar, Toolbar, Button, Typography, Menu, MenuItem } from '@mui/material'
import './Navbar.css'

const Navbar = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <AppBar position='fixed' sx={{ backgroundColor: 'black',height:'16vh',paddingTop:'18px',borderBottom:'2px solid' }}>
                <Toolbar>
                    <Typography variant='h3'>
                        {/* Logo with a link */}
                        <a href="https://f2fintech.com/" target="_blank" rel="noopener noreferrer">
                            <img src="https://i0.wp.com/f2fintech.com/wp-content/uploads/2022/09/cropped-F2-Fintech-logo-1-removebg-preview.png?w=500&ssl=1" />
                        </a>
                        </Typography>
                        <Box display={'flex'} marginLeft={"auto"}>
                        <Button sx={{ margin: 1, color: 'white', '&:hover': { backgroundColor: 'brown', color: 'white', fontWeight: 'bold',padding:'8px 30px' } }} component={Link} to='/'>Case Login</Button>
                         <Button sx={{ margin: 1, color: 'white', '&:hover': { backgroundColor: 'brown', color: 'white', fontWeight: 'bold' }, whiteSpace: 'nowrap', marginLeft: '70px' }} component={Link} to='/rec'>Upload TVR Recording</Button>
                        <Button sx={{ margin: 1, color: 'white', '&:hover': { backgroundColor: 'brown', color: 'white', fontWeight: 'bold' }, whiteSpace: 'nowrap',marginLeft:'70px' }} component={Link} to='/login'>Ops Teams Login</Button>
                        {/* <Button
                            aria-controls="assign-menu"
                            aria-haspopup="true"
                            onClick={handleMenuClick}
                            sx={{ margin: 1, color: 'white', '&:hover': { backgroundColor: 'brown', color: 'white', fontWeight: 'bold'} }}
                        >
                            OpsAssignTo
                        </Button>
                        <Menu
                            id="assign-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem component={Link} to='/nisha' onClick={handleClose}>Nisha Page</MenuItem>
                            <MenuItem component={Link} to='/furkan' onClick={handleClose}>Furkan Page</MenuItem>
                            <MenuItem component={Link} to='/anit' onClick={handleClose}>Anit Page</MenuItem>
                            <MenuItem component={Link} to='/anurandhan' onClick={handleClose}>Anurandhan Page</MenuItem>
                            <MenuItem component={Link} to='/manoj' onClick={handleClose}>Manoj Page</MenuItem>
                            <MenuItem component={Link} to='/muskan' onClick={handleClose}>Muskan Page</MenuItem>
                            <MenuItem component={Link} to='/aaditi' onClick={handleClose}>Aaditi Page</MenuItem>
                        </Menu> */}
                        <Button sx={{ margin: 1, color: 'white', '&:hover': { backgroundColor: 'brown', color: 'white', fontWeight: 'bold' }, whiteSpace: 'nowrap',marginRight:'40px'}} component={Link} to='/OpsForm'>Ops Teams Form</Button>
                        <Button sx={{ margin: 1, color: 'white', '&:hover': { backgroundColor: 'brown', color: 'white', fontWeight: 'bold' } }} component={Link} to='/reg'>SignUp</Button>
                    </Box>
                </Toolbar>
            </AppBar>
            <Toolbar />
        </>
    );
};

export default Navbar;
