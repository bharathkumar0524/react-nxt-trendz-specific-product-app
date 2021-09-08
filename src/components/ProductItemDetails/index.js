// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'

import './index.css'

const productItemStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productItemStatus: productItemStatusConstants.initial,
    productItem: [],
    count: 1,
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  getProductItemDetails = async () => {
    this.setState({productItemStatus: productItemStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      const updatedData = {
        availability: data.availability,
        title: data.title,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        totalReviews: data.total_reviews,
        similarProducts: data.similar_products.map(eachItem => ({
          id: eachItem.id,
          availability: eachItem.availability,
          brand: eachItem.brand,
          description: eachItem.description,
          imageUrl: eachItem.image_url,
          price: eachItem.price,
          rating: eachItem.rating,
          style: eachItem.style,
          title: eachItem.title,
          totalReviews: eachItem.total_reviews,
        })),
      }
      this.setState({
        productItem: updatedData,
        productItemStatus: productItemStatusConstants.success,
      })
    } else {
      this.setState({
        productItemStatus: productItemStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="products-details-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onClickPlus = () => {
    this.setState(prev => ({count: prev.count + 1}))
  }

  onClickMinus = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prev => ({count: prev.count - 1}))
    }
  }

  renderSuccessView = () => {
    const {productItem, count} = this.state
    const {
      title,
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      totalReviews,
      similarProducts,
    } = productItem

    return (
      <div className="product-details-success-view">
        <div className="product-details-container">
          <img src={imageUrl} alt="product" className="product-image" />
          <div className="product">
            <h1 className="product-name">{title}</h1>
            <p className="price-details">RS {price}/-</p>
            <div className="rating-and-reviews-count">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="reviews-count">{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <div className="label-value-container">
              <p className="label">Available:</p>
              <p className="value">{availability}</p>
            </div>
            <div className="label-value-container">
              <p className="label">Brand:</p>
              <p className="value">{brand}</p>
            </div>
            <hr className="horizontal-line" />
            <div className="quantity-container">
              <button
                type="button"
                testid="minus"
                onClick={this.onClickMinus}
                className="quantity-controller-button"
              >
                <BsDashSquare />
              </button>
              <p className="quantity">{count}</p>
              <button
                type="button"
                testid="plus"
                onClick={this.onClickPlus}
                className="quantity-controller-button"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="button add-to-cart-btn">
              ADD TO CART
            </button>
          </div>
        </div>

        <h1 className="similar-products-heading">Similar Products</h1>
        <ul className="similar-products-list">
          {similarProducts.map(eachProduct => (
            <SimilarProductItem
              productItem={eachProduct}
              key={eachProduct.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="product-details-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
        className="error-view-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderProductItem = () => {
    const {productItemStatus} = this.state
    switch (productItemStatus) {
      case productItemStatusConstants.success:
        return this.renderSuccessView()
      case productItemStatusConstants.failure:
        return this.renderFailureView()
      case productItemStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderProductItem()}
        </div>
      </>
    )
  }
}
export default ProductItemDetails
