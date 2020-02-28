import React from 'react'
import { navigate } from 'gatsby'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  button: {
    padding: '3px 6px',
    textAlign: 'center',
    fontSize: '12px',
    margin: '0',
    textTransform: 'uppercase',
    transition: '0.5s',
    backgroundSize: '200% auto',
    color: 'white',
    borderRadius: '5px',
    backgroundImage: theme.gradient.primary,
    '&:hover': {
      backgroundPosition: 'right center',
      boxShadow: '0 7px 14px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.22)',
    },
  },
}))

const handleClick = (event, link) => {
  event.preventDefault()
  navigate(link)
}

const LinkButton = props => {
  const classes = useStyles()
  return (
    <Button
      size="small"
      className={classes.button}
      onClick={event => handleClick(event, props.to)}
      endIcon={props.endIcon}
      startIcon={props.startIcon}
    >
      {props.children}
    </Button>
  )
}

export default LinkButton
