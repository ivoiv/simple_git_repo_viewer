import { connect } from "react-redux"
import { Frontpage } from "../components"
import { API_getGithubRepos, changeCurrentPage } from "../store/ducks/frontpage"

/*********************************
 * Frontpage Container
*********************************/

const mapStateToProps = (state) => {

  const {items, loading, current_page, error, error_message} = state.frontpage.repositories
  
  return {
    repositories: items,
    loading: loading,
    current_page: current_page,
    error: error,
    error_message: error_message
  }
}

const mapDispatchToProps = {
  API_getGithubRepos,
  changeCurrentPage
}

const FrontpageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Frontpage)

export default FrontpageContainer
