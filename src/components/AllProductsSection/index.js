import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

class AllProductsSection extends Component {
  state = {
    productsList: [],
    phase: '',
    activeOptionId: sortbyOptions[0].optionId,
    title: '',
    rating: '',
    category: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      phase: 'Loading',
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId, title, rating, category} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${category}&title_search=${title}&rating=${rating}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        phase: 'Success',
      })
    } else {
      this.setState({phase: 'Fail'})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  getNewSearch = () => {
    this.setState({phase: 'Loading'}, this.getProducts)
  }

  changeTitle = e => {
    this.setState({title: e})
  }

  changeCatId = id => {
    this.setState({category: id, phase: 'Loading'}, this.getProducts)
  }

  changeRating = e => {
    this.setState({rating: e, phase: 'Loading'}, this.getProducts)
  }

  clearFilters = () => {
    this.setState(
      {phase: 'Loading', category: '', rating: '', title: ''},
      this.getProducts,
    )
  }
//No products view
  renderNoProducts = () => (
    <div className="noProducts">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        alt="no products"
      />
      <h1>No Products Found</h1>
      <p>We could not find any products. Try other filters</p>
    </div>
  )

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    if (productsList.length === 0) {
      return this.renderNoProducts()
    }
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view
  renderFailure = () => (
    <div className="fail">
      <img
        className="failImg"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
      />
    </div>
  )

  getPhase = () => {
    const {phase} = this.state

    switch (phase) {
      case 'Loading':
        return this.renderLoader()
      case 'Fail':
        return this.renderFailure()
      default:
        return this.renderProductsList()
    }
  }

  render() {
    const {title, category, rating} = this.state

    return (
      <div className="all-products-section">
        <FiltersGroup
          catList={categoryOptions}
          ratList={ratingsList}
          titleValue={title}
          getNewSearch={this.getNewSearch}
          changeTitle={this.changeTitle}
          changeCatId={this.changeCatId}
          actCatId={category}
          actRatId={rating}
          changeRating={this.changeRating}
          clearFilters={this.clearFilters}
        />
        {this.getPhase()}
      </div>
    )
  }
}

export default AllProductsSection
