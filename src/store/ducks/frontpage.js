import API_URL from './api'


/*********************************
 * Get Github Repositories 
 * -- Reducer, API, Actions
*********************************/


const GET_GITHUB_REPOS_REQUEST = "GET_GITHUB_REPOS_REQUEST"
const GET_GITHUB_REPOS_SUCCESS = "GET_GITHUB_REPOS_SUCCESS"
const GET_GITHUB_REPOS_FAILURE = "GET_GITHUB_REPOS_FAILURE"


//Initial State
const initState = {
  repositories: {
    items:[],
    loading:true,
    current_page:1,
    error:false
  }
}

const getGitHubReposRequest = () => {
  return {
    type: GET_GITHUB_REPOS_REQUEST
  }
}

const getGitHubReposSuccess = (repos) => {
  return {
    type: GET_GITHUB_REPOS_SUCCESS,
    repos
  }
}

const getGitHubReposFailure = (error) => {
  return {
    type: GET_GITHUB_REPOS_FAILURE,
    error
  }
}

const checkForError = (response) => {
  if (!response.ok) {
    throw Error(response.statusText);
}
  return response;
}

/* In case of wrong page number, first get API response, calculate number of pages to show
*  if page number is invalid, switch to page 1 and load that page
*  If page is correct load load requested page
*/
const handleSuccess = (dispatch, response, initial_page, history, items_per_page) => {
   
  //If invalid page address go to page 1, else go to specified page.
  if (isNaN(initial_page) || initial_page < 1 || initial_page > response.items.length/items_per_page){
    dispatch(changeCurrentPageRequest(1))
    history.push("/frontpage/page/".concat("1"))
  } else {
      dispatch(changeCurrentPageRequest(initial_page))
      history.push("/frontpage/page/".concat(initial_page))
  }
  
  return dispatch(getGitHubReposSuccess(response)) 

  
}

//Exposed API call for getting repositories
export const API_getGithubRepos = (initial_page, history, items_per_page) => {
  return function (dispatch) {
    dispatch(getGitHubReposRequest())
    return fetch(API_URL)
      .then(resp => checkForError(resp))
      .then(resp => resp.json())
      .then(data => handleSuccess(dispatch, data, initial_page, history, items_per_page))
      .catch(error => dispatch(getGitHubReposFailure(error))) 
  }
}


const getGitHubReposReducer = (state, action) => {
  switch (action.type) {

    case GET_GITHUB_REPOS_REQUEST:
    return {
      repositories: {
        ...state.repositories,
        loading: true,
        error: false
      }
    }
    case GET_GITHUB_REPOS_SUCCESS:
        return {
          repositories: {
            ...state.repositories,
            ...action.repos,
            loading: false,
            error: false
          }
        }
    case GET_GITHUB_REPOS_FAILURE:
      return {
        repositories: {
          ...state.repositories,
          loading: false,
          error: true,
          error_message:action.error.message
        }
      }
    default:
      return state
  }
}


/*********************************
 * Change visible page 
 * -- Reducer, API, Actions
*********************************/


const CHANGE_CURRENT_PAGE_REQUEST= "CHANGE_CURRENT_PAGE_REQUEST"

const changeCurrentPageRequest = (page) => {
  return {
    type: CHANGE_CURRENT_PAGE_REQUEST,
    page
  }
}

const changeCurrentPageReducer = (state, action) => {
  switch (action.type) {
    case CHANGE_CURRENT_PAGE_REQUEST:
     return{
       ...state,
       current_page: action.page
     }
    default:
     return state;
  }
}

//Exposed function for page changing
export const changeCurrentPage = (page, history) => {
  return function(dispatch){
    dispatch(changeCurrentPageRequest(page))
    history.push("/frontpage/page/".concat(page))
  }
}

/*********************************
 * Main Frontpage Reducer
*********************************/

function reducer(state = initState, action) {
  switch (action.type) {
    case GET_GITHUB_REPOS_REQUEST:
    case GET_GITHUB_REPOS_SUCCESS:
    case GET_GITHUB_REPOS_FAILURE:
      return getGitHubReposReducer(state, action)
    case CHANGE_CURRENT_PAGE_REQUEST:
      return{
        ...state,
        repositories: changeCurrentPageReducer(state.repositories, action)
      }
    default:
      return state
  }
}

export default reducer