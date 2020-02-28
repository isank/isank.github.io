import React from 'react'
import { Link as GatsbyLink } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  link: {
    outline: 'none',
    textDecoration: 'none',
    width: '100%',
    display: 'block',
    height: '100%',
    paddingLeft: '5px',
    paddingTop: '8px',
    paddingBottom: '8px',
    borderRadius: '5px',
    '&:link': {},
    '&:visited': {
      color: theme.palette.text.primary,
    },
    '&:focus': {},
    '&:hover': {},
    '&:active': {},
  },
}))

const Link = props => {
  const classes = useStyles()
  return (
    <GatsbyLink
      className={classes.link}
      to={props.to}
      activeClassName={props.activeClassName}
    >
      {props.children}
    </GatsbyLink>
  )
}

export default Link
