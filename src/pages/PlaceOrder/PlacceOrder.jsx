import { useContext, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'
import { FlutterwaveButton, closePaymentModal } from 'flutterwave-react-v3';


const PlacceOrder = () => {

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
       

    const config = {
        public_key: 'FLWPUBK_TEST-88a3845b6ba96094a720db06df3bfdc0-X',
        tx_ref: Date.now(),
        amount: getTotalCartAmount()+3000,
        currency: 'NGN',
        payment_options: 'card,mobilemoney,ussd',
        customer: {
          email: data.email,
          phone_number: data.phone,
          name: data.firstName + ' ' + data.lastName,
        },
        customizations: {
          title: 'Market Square',
          description: 'Payment for items in cart',
          logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
        },
      };
    const fwConfig = {
            ...config,
            text: 'Pay with Flutterwave!',
            callback: (response) => {
               console.log(response);
              closePaymentModal() // this will close the modal programmatically
            },
            onClose: () => {},
          };
      };


    return (
        <form  className='place-order'>
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
              {/* <button type='submit'>PROCEED TO PAYMENT</button> */}
              <FlutterWaveButton {...fwConfig} />
            </div>
          </div>
        </form>
      )
}

export default PlacceOrder
