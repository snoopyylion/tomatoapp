import { useContext, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';


const Place0rder = () => {
  const notify = () => toast("Order Successfully Placed, Kindly wait for payment page and do not reload the page!");

  const {getTotalCartAmount, token, food_list, cartItems, url} =useContext(StoreContext);

  const [data,setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({...data,[name]:value}));
  }

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id]>0){
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo)
      }
    })
    let orderData = {
      address:data,
      items:orderItems,
      amount:getTotalCartAmount()+3000,
    }
    let response = await axios.post(url+"/api/order/place",orderData,{headers:{token}});
    console.log(response)
    if (response.status === 200) {
      //  access flutterwave payment gateway link from response
      const payment_gateway_link = response.data.payment.data.link;
      window.location.href = payment_gateway_link
      // window.location.replace(session_url);
    }
    else {
      alert("Error making payment");
    }
  }


  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className='place-order-left'>
        <p className='title'>Delivery Information</p>
        <div className="multi-fields">
          <input onChange={onChangeHandler} required name='firstName' value={data.firstName} type="text" placeholder='First Name' />
          <input onChange={onChangeHandler} required name='lastName' value={data.lastName} type="text" placeholder='Last Name'/>
        </div>
        <input onChange={onChangeHandler} required name='email' value={data.email} type="email" placeholder='Email address' />
        <input onChange={onChangeHandler}required name='street' value={data.street} type="text" placeholder='Street address'/>
        <div className="multi-fields">
          <input onChange={onChangeHandler} required name='city' value={data.city} type="text" placeholder='City' />
          <input onChange={onChangeHandler}required name='state' value={data.state} type="text" placeholder='State'/>
        </div>
        <div className="multi-fields">
          <input onChange={onChangeHandler} required name='zipcode' value={data.zipcode} type="text" placeholder='Zip code' />
          <input onChange={onChangeHandler} required name='country' value={data.country} type="text" placeholder='Country'/>
        </div>
        <input onChange={onChangeHandler} required name='phone' value={data.phone} type="text" placeholder='Phone' />
      </div>
      <div className='place-order-right'>
      <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₦{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₦{getTotalCartAmount()===0?0:3000}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₦{getTotalCartAmount()===0?0:getTotalCartAmount()+3000}</b>
            </div>
          </div>
          <button onClick={notify} type='submit'>PROCEED TO PAYMENT</button>
          <ToastContainer />
        </div>
      </div>
    </form>
  )
}

export default Place0rder
