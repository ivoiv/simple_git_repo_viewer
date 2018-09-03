import React from "react";
import {Fragment} from 'react'
import CircularProgress from "@material-ui/core/CircularProgress";
import RepositoriesList from "./RepositoriesList";
import { Hidden, Typography, Grid, IconButton } from "@material-ui/core";
import ForwardIcon from "@material-ui/icons/ArrowForward";
import BackIcon from "@material-ui/icons/ArrowBack";
import ErrorIcon from "@material-ui/icons/Error";


//Number of repositires to be shown per page
const REPOS_PER_PAGE = 5;
const VISIBLE_PAGES = 5;

export default class Frontpage extends React.Component {

    
  //Once component will be shown 
  componentDidMount() {
    const { history, API_getGithubRepos, match:{params :{ number } }} = this.props
    const initial_page = parseInt(number, 10)

    //Get Repositories from GitHub API for current page
    API_getGithubRepos(initial_page, history, REPOS_PER_PAGE)

  }
  //Switches active page. 
  //For use with page links under.
  goToPage(page) {
      
    const { history, repositories, current_page, changeCurrentPage } = this.props;
    const num_pages = repositories.length / REPOS_PER_PAGE;

    window.scrollTo(0,0)
    if (page === "next") return () => changeCurrentPage(current_page + 1, history);
    if (page === "previous") return () => changeCurrentPage(current_page - 1, history);
    if (page >= 1 && page <= num_pages) return () => changeCurrentPage(page, history);
    else console.error("Non-existing page number: " + page);
  }



  //Creates page buttons and links (1, 2, 3, 4, etc.)
  //For use with nagivation creator under.
  makePageButtons() {
    const { repositories, current_page } = this.props;
    
    const num_pages = repositories.length / REPOS_PER_PAGE;
    var pages = [];
    
    var pageRange = Math.floor((VISIBLE_PAGES/2));
    var startPage = current_page-pageRange;

    if(startPage < 1){
      startPage = 1;
    }

    var endPage = startPage + VISIBLE_PAGES-1;

    if(endPage > num_pages){
      startPage = num_pages-VISIBLE_PAGES+1;
      endPage = num_pages;
    }

    //Adds page links and makes page link for current page larger
    for (let i = startPage; i <= endPage; i++) {
      if (i === current_page)
        pages.push(
          <IconButton
            key={i}
            className={'pageNumbers'}
            onClick={this.goToPage(i)}
            style={{ color: "black", fontSize: "2em" }}
          >
            {i}
          </IconButton>
        )
      else
        pages.push(
          <IconButton key={i} onClick={this.goToPage(i)}>
            {i}
          </IconButton>
        );
    }

    return pages;
  }

  //Creates navigation bar with Nagivation arrows and page links(with makePageButtons())
  createNavigation() {
    const { repositories, current_page } = this.props;
    const num_pages = repositories.length / REPOS_PER_PAGE;

    let navigation = [];

    //Disabled Previous button if on page 1
    if (current_page > 1)
      navigation.push(
        <Hidden smDown>
          <IconButton key={'previous'} onClick={this.goToPage("previous")}>
            <BackIcon hidden />
          </IconButton>
        </Hidden>);
    else navigation.push(
      <Hidden smDown>
        <IconButton  key={'previous'} disabled />
      </Hidden>);

    //Adds page links
    navigation.push(this.makePageButtons());

    //Disables Next button if on last page
    if (current_page < num_pages)
      navigation.push(
        <Hidden smDown>
          <IconButton  key={'next'} onClick={this.goToPage("next")}>
            <ForwardIcon />
          </IconButton>
        </Hidden>
      );
    else navigation.push(
      <Hidden smDown>
        <IconButton key={'next'} disabled/>
      </Hidden>);

    return navigation;
  }



    //Returns a slice of the repositires to be displayed.
  itemsToDisplay() {
    const { repositories, current_page } = this.props;
    const lastItemNumber = current_page * REPOS_PER_PAGE;
    const firstItemNumber = lastItemNumber - REPOS_PER_PAGE;
    
    return repositories.slice(firstItemNumber, lastItemNumber);
  }

  render() {
    const {error, error_message, loading, current_page } = this.props;

    return (
      <Fragment>
        
        {/* Page title */}
        <Typography
          variant="title"
          style={{ margin: "16px 0 16px 8px", color: "green" }}
        >
          Simple GitHub Repo Viewer
        </Typography>
        
        {/* While page is loading show loading circle */}
        {loading ? (
          <Grid container style={{ height: "100vh" }} justify="center">
            <CircularProgress
              size={64}
              style={{
                margin: "auto"
              }}
            />
          </Grid>
        ) 
          //If error while loading repoistories show error message
          : (error? 
                <Grid container style={{ height: "100vh" }} direction='column' justify='center' alignItems='center'>
                  <Grid item>
                    <ErrorIcon
                      style={{
                        textAlign:'center',
                        fontSize:'3em',
                        color: 'red'
                      }}
                    />
                  </Grid>

                  <Grid item>
                    <Typography>{error_message}</Typography>
                  </Grid>

                  <Grid item>
                    <Typography>{"Probably too many requests to API. Wait a few seconds and try again."}</Typography>
                  </Grid>
                    
                </Grid>
                
                //When loaded and if no errors, display repositories
                : <Grid container style={{overflowX:'hidden'}}justify="center">
                    <Grid item xs={12}>
                    {/* Repositories to be displayed */}
                     <RepositoriesList currentPage={current_page} items={this.itemsToDisplay()} />
                    </Grid>

                     {/* Navigation bar */}
                    <Grid style={{ marginTop: 24 }} item>
                      {this.createNavigation()}
                    </Grid>
                </Grid>
            )}
      </Fragment>
    );
  }
}
