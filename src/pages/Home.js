import React, { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import axios from "axios";
import moment from 'moment'

const Home = () => {
  const [fromDate, setFromDate] = useState(moment())
  const [toDate, setToDate] = useState(moment())
  const [search, setSearch] = useState()
  const [selected, setSelected] = useState()

  // Table colums
  const [tcol, setT_Col] = useState([])
  // Table Rows
  const [traw, setT_Raw] = useState([])
  // Dropdown
  const [drop, setDrop] = useState([])



  const getDate = async () => {
    try {
      let url = search ?
        `http://logstore.sandboxing.tech/?database=azercell&query=SELECT * FROM azercell.${selected} WHERE (TIMESTAMP >= toDateTime('${moment(fromDate).format('YYYY-MM-DD HH:mm:ss')}')) AND (TIMESTAMP <= toDateTime('${moment(toDate).format('YYYY-MM-DD HH:mm:ss')}')) AND MSI= '${search}' LIMIT 100 FORMAT JSON` : `http://logstore.sandboxing.tech/?database=azercell&query=SELECT * FROM azercell.${selected} WHERE (TIMESTAMP >= toDateTime('${moment(fromDate).format('YYYY-MM-DD HH:mm:ss')}')) AND (TIMESTAMP <= toDateTime('${moment(toDate).format('YYYY-MM-DD HH:mm:ss')}')) LIMIT 100 FORMAT JSON`
      const res = await axios.get(url)
      console.log(res.data.data.length, "url")
      setT_Col(res.data.meta)
      setT_Raw(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  // GEt Data for dropdown
  const getDropDown = async () => {
    try {
      let url = "http://logstore.sandboxing.tech/?database=azercell&query=show%20tables%20like%20%27srv_%25%27%20FORMAT%20JSON"
      const res = await axios.get(url)
      console.log(res.data, "getDropDown")
      setDrop(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getDropDown()
  }, [])
  useEffect(() => {
    getDate()
  }, [fromDate, toDate, search, selected])


  tcol.shift()
  return (
    <div>
      <div class="bg-gray-100">
        <div className="">
          {/* Dropdown */}
          <div className="">
            <select value={selected} onChange={(e) => setSelected(e.target.value)}>
              <option value="">Select</option>
              {
                drop.map((d, i) => {
                  return <option key={i} value={d.name}>{d.name}</option>
                })
              }
            </select>
          </div>
          {/* Form */}
          <div className="">
            <span className="">From</span>
            <input type="date" value={moment(fromDate).format('YYYY-MM-DD')} onChange={(e) => { setFromDate(e.target.value); console.log(e.target.value) }} />
          </div>
          {/* TO */}
          <div className="">
            <span className="">To</span>
            <input type="date" value={moment(toDate).format('YYYY-MM-DD')} onChange={(e) => { setToDate(e.target.value); console.log(e.target.value) }} />
          </div>
          {/* SearchBar */}
          <div className="">
            <span>Search</span>
            <input type="number" value={search} onChange={(e) => { setSearch(e.target.value); console.log(e.target.value) }} placeholder="enter MSI" />
          </div>
        </div>
        <Table striped bordered hover>
          <thead>

            <tr>
              {tcol.map((e, i) => {
                return (
                  <th key={i}>
                    {e.name}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {traw.map((e, i) => {
              return <tr key={i}>
                <td>{e.SERIALNO}</td>
                <td>{e.LAC}</td>
                <td>{e.CELLID}</td>
                <td>{e.MSI}</td>
                <td>{e.IMSI}</td>
                <td>{e.IPV4}</td>
                <td>{e.IPV6}</td>
                <td>{e.CALLDURATION}</td>
                <td>{e.CALLSIDE}</td>
                <td>{e.NET}</td>
                <td>{e.CALLINGPARTYNUMBER}</td>
                <td>{e.CALLINDPARTYNUMBER}</td>
                <td>{e.DIALEDNUMBER}</td>
                <td>{e.SUBCOSID}</td>
                <td>{e.PRODUCTID}</td>
                <td>{e.ACCOUNTID}</td>
                <td>{e.SUBSCRIBERID}</td>
                <td>{e.BRANDID}</td>
                <td>{e.CALLREFERENCENUMBER}</td>
                <td>{e.DIAMETERSESSIONID}</td>
                <td>{e.KEYS}</td>
              </tr>
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Home;
