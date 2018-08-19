import React from 'react'
import './RepositoriesList.css'
import { Fragment } from 'react'
import { Icon, CardActions, Avatar, Grid, Card, CardContent, CardHeader, Typography } from '@material-ui/core'
import StarIcon from '@material-ui/icons/Star';
import ForkIcon from '@material-ui/icons/CallSplit';
    

export default class RepositoriesList extends React.Component{

  //Splits repository names into two lines and thickens 2nd line
  itemName(str){
      const split = str.split("/");
      return <Fragment>
              <Typography>
                {split[0].concat(" /")}
              </Typography>

              <Typography noWrap style={{fontWeight:900}}>
                {split[1]}
              </Typography>
            </Fragment>
  }

  render(){
      const { items } = this.props

      return(
          <Grid container spacing={8}>
            {items.map((item, i) => (
              <Grid key={i} item xs={12} md={3}>
                <Card className='card' onClick={ () => window.open(item.html_url)} style={{height: 132}}>
                  <CardHeader
                    style={{padding:16, overflow:'hidden'}}
                    avatar={
                      <Avatar 
                        style={{borderRadius:2}} 
                        //Repository icon
                        src={item.owner.avatar_url}
                      />
                    }
                    // Repoistory name
                    title={this.itemName(item.full_name)}
                  />
                  
                  <CardContent style={{ paddingTop:0, paddingBottom:0, overflow:'hidden' }}>                       
                    <Typography noWrap>{item.description}</Typography>
                  </CardContent>
                  
                  <CardActions>
                    {/* Stargazers */}
                    <Icon>
                      <StarIcon/>
                    </Icon>
                    <Typography>{item.stargazers_count}</Typography>

                    {/* Forks */}
                    <Icon style={{marginLeft:24}}>
                      <ForkIcon/>
                    </Icon>
                    <Typography>{item.forks_count}</Typography>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
      )
  }
}
