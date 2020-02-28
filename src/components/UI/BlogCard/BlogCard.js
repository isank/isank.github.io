import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import LinkButton from '../Button/LinkButton'

const useStyles = makeStyles(theme => ({
  card: {
    margin: '15px 10px 15px 10px',
    boxShadow: '0 7px 14px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.22)',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
    '&:hover': {
      boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    },
  },
  content: {
    textAlign: 'left',
    padding: theme.spacing(2),
  },
  actions: {
    textAlign: 'left',
    padding: theme.spacing(2),
  },
  title: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
  },
  desc: {
    lineHeight: 1.5,
  },
  avatar: {
    border: '2px solid white',
    '&:not(:first-of-type)': {
      marginLeft: -theme.spacing(),
    },
  },
}))

const BlogCard = props => {
  const classes = useStyles()

  return (
    <Grid item sm={12} lg={4}>
      <Card className={classes.card}>
        <CardContent className={classes.content}>
          <Typography className={classes.title} variant={'h6'}>
            {props.blog.title}
          </Typography>
          <Typography variant="body2" className={classes.desc}>
            {props.blog.desc}
          </Typography>
        </CardContent>
        <CardActions className={classes.actions}>
          <LinkButton to={props.blog.link}>Read</LinkButton>
        </CardActions>
      </Card>
    </Grid>
  )
}

export default BlogCard
