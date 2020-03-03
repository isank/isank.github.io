import React from 'react'

import SEO from './SEO'

import CssBaseline from '@material-ui/core/CssBaseline'
import Hidden from '@material-ui/core/Hidden'

import NavBar from './UI/NavBar/NavBar'
import SideBar from './UI/SideBar/SideBar'

import { makeStyles } from '@material-ui/core/styles'
import { useMediaQuery } from '@material-ui/core'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import customTheme from '../assets/theme/customTheme'

const useDarkMode = () => {
  const [theme, setTheme] = React.useState(customTheme)
  const {
    palette: { type },
  } = theme

  const toggleDarkMode = () => {
    const updatedTheme = {
      ...theme,
      palette: {
        type: type === 'light' ? 'dark' : 'light',
      },
    }

    setTheme(updatedTheme)
  }
  return [theme, toggleDarkMode]
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    minHeight: `100vh`,
  },
}))

const Layout = props => {
  const classes = useStyles()

  let prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const [mobileOpen, setMobileOpen] = React.useState(false)

  const [theme, toggleDarkMode] = useDarkMode()

  const themeConfig = createMuiTheme(theme)

  console.log(prefersDarkMode)

  if (prefersDarkMode === true && themeConfig.palette.type === 'light') {
    console.log('Inside')
    toggleDarkMode()
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <>
      <SEO />
      <ThemeProvider theme={themeConfig}>
        <div className={classes.root}>
          <CssBaseline />
          <SideBar
            clicked={handleDrawerToggle}
            mobileOpen={mobileOpen}
            toggled={toggleDarkMode}
          />
          <NavBar clicked={handleDrawerToggle} />
          <main className={classes.content}>
            {props.children}
            <Hidden smUp implementation="css">
              <div className={classes.toolbar} />
            </Hidden>
          </main>
        </div>
      </ThemeProvider>
    </>
  )
}

export default Layout
