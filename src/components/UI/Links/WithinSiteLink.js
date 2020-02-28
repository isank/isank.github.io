import React from 'react'
import { Link as GatsbyLink } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  withinSiteLink: {
    outline: 'none',
    textDecoration: 'none',
    padding: '2px 1px 0',
    borderBottom: '1px solid black',
    '&:link': {
      color: '#265301',
    },
    '&:visited': {
      color: '#437A16',
    },
    '&:focus': {
      borderBottom: '1px solid',
      background: '#BAE498',
    },
    '&:hover': {
      borderBottom: '1px solid',
      background: '#CDFEAA',
    },
    '&:active': {
      background: '#265301',
      color: '#CDFEAA',
    },
  },
}))

const WithinSiteLink = props => {
  const classes = useStyles()
  return (
    <GatsbyLink className={classes.withinSiteLink} to={props.to}>
      {props.children}
    </GatsbyLink>
  )
}

export default WithinSiteLink
