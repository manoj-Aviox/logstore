  import React, { useEffect, useState } from "react";
  import Table from 'react-bootstrap/Table';
import HeaderNav from "../components/Header";
import Sidebar from "../components/SideNav";

import Slider from 'react-rangeslider'

// To include the default styles
import 'react-rangeslider/lib/index.css'
// Not using an ES6 transpiler
// var Slider = require('react-rangeslider')

  const[value,setValue] = useState();


  const handleChangeStart = () => {
  console.log('Change event started')
};

const handleChange = value => {
  this.setState({
    value: value
  })
};

const handleChangeComplete = () => {
  console.log('Change event completed')
};

  const Home = () => {
    
    return (
      <div>
    <HeaderNav/>
    <Sidebar/>
    {/* <!--Container Main start--> */}
    <div className="height-100 bg-light inner-banner">
        <h4 className="">Filter</h4>
        <div className="">
          <form>
          <div className='slider'>
            <Slider
              min={0}
              max={100}
              value={value}
              onChangeStart={handleChangeStart}
              onChange={handleChange}
              onChangeComplete={handleChangeComplete}
            />
            <div className='value'>{value}</div>
          </div>
          </form>
        </div>
    </div>
  </div>
    );
  };

  export default Home;
