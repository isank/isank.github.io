import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Hidden from '@material-ui/core/Hidden'

const useStyles = makeStyles(theme => ({
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  grow: {
    flexGrow: 1,
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
  },
}))

const NavBar = props => {
  const classes = useStyles()

  return (
    <Hidden smUp implementation="css">
      <AppBar position="fixed" color="default" className={classes.appBar}>
        <Toolbar>
          {/* <Fab color="secondary" aria-label="add" className={classes.fabButton}>
            <ArrowUpwardIcon />
          </Fab> */}
          <div className={classes.grow} />
          <IconButton
            edge="end"
            color="inherit"
            aria-label="open drawer"
            onClick={props.clicked}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Hidden>
  )
}

export default NavBar
