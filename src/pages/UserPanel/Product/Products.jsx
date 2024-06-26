import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../../actions/ProductAction';
import { Card, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { CardMedia } from '@mui/material';
import Loader from '../../../components/UserDashBoard/Layout/Loader/Loader';
import ReactStars from 'react-rating-stars-component';
import axios from 'axios';
import { getCategory } from '../../../components/Redux/Slice/category'; // Import getCategory action
import ReactPaginate from 'react-paginate'; // Import ReactPaginate
import {  MdSkipNext, MdSkipPrevious } from "react-icons/md";
function Products() {
  const { keyword } = useParams();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.data);
  const categoryList = useSelector((state) => state.cate.category);
  console.log(categoryList);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [priceRanges, setPriceRanges] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const productsPerPage = 10; // Number of products per page

  useEffect(() => {
    dispatch(getProducts(keyword));
    
  }, [dispatch, keyword]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/categorys', { withCredentials: true });
        dispatch(getCategory(response.data.categorys));
       
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    // Find min and max prices
    const minProductPrice = Math.min(...products.map(product => product.price));
    const maxProductPrice = Math.max(...products.map(product => product.price));

    // Create price ranges
    const ranges = [];
    for (let i = minProductPrice; i <= maxProductPrice; i += 1000) {
      ranges.push({ min: i, max: i + 1000 });
    }
    setPriceRanges(ranges);
  }, [products]);

  useEffect(() => {
    let filtered = products;

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => selectedCategories.includes(product.categoryId));
    }

    // Filter by selected price ranges
    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter(product => {
        return selectedPriceRanges.some(range => product.price >= range.min && product.price <= range.max);
      });
    }

    setFilteredProducts(filtered);
  }, [selectedCategories, selectedPriceRanges, products]);

  const handleCategoryClick = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handlePriceRangeClick = (range) => {
    if (selectedPriceRanges.some(r => r.min === range.min && r.max === range.max)) {
      setSelectedPriceRanges(selectedPriceRanges.filter(r => r.min !== range.min || r.max !== range.max));
    } else {
      setSelectedPriceRanges([...selectedPriceRanges, range]);
    }
  };

  // Paginate your filtered products
  const indexOfLastProduct = (pageNumber + 1) * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className='container'>
          <Row>
            <h3>PRODUCTS</h3>
          </Row>

          <div className='filters'>
            <div className='categoryList'>
            {categoryList ? (
      categoryList.map((item) => (
        <div className='category' key={item._id}>
          <p className='cateitems'>
            <input
              type="checkbox"
              checked={selectedCategories.includes(item._id)}
              onChange={() => handleCategoryClick(item._id)}
            />
            <span>{item.name}</span>
          </p>
        </div>
      ))
    ) : (
      <p>Loading categories...</p>
    )}
            </div>
            <div className='price-filter'>
              {priceRanges.map((range, index) => (
                <div key={index}>
                  <p className='cateitems' >
                    <input
                      type="checkbox"
                      checked={selectedPriceRanges.some(r => r.min === range.min && r.max === range.max)}
                      onChange={() => handlePriceRangeClick(range)}
                    />
                    {`₹${range.min} - ₹${range.max}`}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className='products-container'>
            {products && currentProducts.length > 0 ? (
              currentProducts.map((product, index) => (
                <div className='product-card' key={index}>
                  <Link className='link' to={`/product/${product._id}`}>
                    <Card className='cards'>
                    <div className='media-img'>
                        <img className='p-img' src={`http://localhost:5000/uploads/${product.images[0]}`}alt={product.name}/>
                    </div>
                      <div className='content'>
                        <p component="div">
                          {product.name}
                        </p>
                        <div className='price-n-rating'>
                          <ReactStars
                            // Add ReactStars props here
                          />
                          <span>{`₹ : ${product.price}`}</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </div>
              ))
            ) : (
              <p>No products available for the selected category and price range</p>
            )}
          </div>

          <ReactPaginate
            previousLabel={<MdSkipPrevious/>}
            nextLabel={<MdSkipNext/>}
            pageCount={Math.ceil(filteredProducts.length / productsPerPage)}
            onPageChange={({ selected }) => setPageNumber(selected)}
            containerClassName={'pagination'}
            activeClassName={'active'}
          />
        </div>
      )}
    </>
  );
}

export default Products;
