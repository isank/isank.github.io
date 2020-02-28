import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

import Link from '../Links/Link'

const drawerWidth = 250

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerContent: {
    height: '100%',
  },
  content: {
    flexGrow: 1,
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    height: '100%',
    padding: theme.spacing(2),
    boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
  },
  large: {
    width: theme.spacing(9),
    height: theme.spacing(9),
  },
  footer: {
    '& label': {
      marginLeft: '0',
      marginRight: '0',
    },
  },
  link: {
    padding: '0px',
    marginTop: theme.spacing(1),
    borderRadius: '5px',
  },
  active: {
    transition: '0.5s',
    borderRadius: '5px',
    color: `${theme.palette.getContrastText(theme.palette.text.primary)} !important`,
    background: theme.gradient.primary,
    boxShadow: '0 7px 14px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.22)',
  },
}))

const CustomSwitch = withStyles(theme => ({
  switchBase: {
    color: '#56ccf2',
    '&$checked': {
      color: '#56ccf2',
    },
    '&$checked + $track': {
      backgroundColor: '#2f80ed',
    },
  },
  checked: {},
  track: {},
}))(Switch)

const SideBar = props => {
  const classes = useStyles()
  const theme = useTheme()

  const drawerContent = (
    <Grid
      container
      direction="column"
      justify="space-between"
      className={classes.drawerContent}
    >
      <Grid item>
        <Avatar className={classes.large}>JD</Avatar>
        <Typography variant="h6" component="h6" gutterBottom>
          Jack Daniels
        </Typography>
        <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
          dolor.
        </Typography>
        <Grid>
          <List>
            <ListItem className={classes.link} button>
              <Link activeClassName={classes.active} to="/about">
                About
              </Link>
            </ListItem>
            <ListItem className={classes.link} button>
              <Link activeClassName={classes.active} to="/blogs">
                Blogs
              </Link>
            </ListItem>
            <ListItem className={classes.link} button>
              <Link activeClassName={classes.active} to="/contact">
                Contact
              </Link>
            </ListItem>
          </List>
        </Grid>
      </Grid>
      <Grid item className={classes.footer}>
        <FormControlLabel
          control={
            <CustomSwitch
              size="small"
              checked={theme.palette.type === 'dark'}
              onClick={props.toggled}
            />
          }
          label="Night Mode: "
          labelPlacement="start"
        />
      </Grid>
    </Grid>
  )

  return (
    <div className={classes.root}>
      <nav className={classes.content}>
        <Hidden smUp implementation="css">
          <Drawer
            className={classes.drawer}
            variant="temporary"
            anchor="left"
            open={props.mobileOpen}
            onClose={props.clicked}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawerContent}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            className={classes.drawer}
            open
          >
            {drawerContent}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  )
}

export default SideBar
