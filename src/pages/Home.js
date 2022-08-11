import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import axios from "axios";
import moment from "moment";
import Select from "react-select";
// import Button from "react-bootstrap/Button";
import { Modal, Button, Alert } from "react-bootstrap";
import HeaderNav from "../components/Header";
const Home = () => {
  const [error, setError] = useState(true);
  const [fromDate, setFromDate] = useState(moment());
  const [toDate, setToDate] = useState(moment());
  console.log(error);
  // const [search, setSearch] = useState();
  const [selected, setSelected] = useState();
  const [limit, setLimit] = useState("10");
  // Modal
  const [show, setShow] = useState(false);
  const [showKey, setShowKey] = useState();
  // Table colums
  const [columns, setColumns] = useState([]);
  // Table Rows
  const [logs, setLogs] = useState([]);
  // Dropdown
  const [drop, setDrop] = useState([]);
  const [queryOptions, setQueryOptions] = useState([]);
  const [selectorOption, setSelectorOption] = useState([]);
  const [selectedSelectorOption, setSelectedSelectorOption] = useState([]);

  const geLog = async () => {
    try {
      let url = `http://logstore.sandboxing.tech/?database=azercell&query=SELECT * FROM azercell.${selected} WHERE (TIMESTAMP >= toDateTime('${moment(
        fromDate
      ).format(
        "YYYY-MM-DD HH:mm:ss"
      )}')) AND (TIMESTAMP <= toDateTime('${moment(toDate).format(
        "YYYY-MM-DD HH:mm:ss"
      )}')) LIMIT ${limit} FORMAT JSON`;
      const res = await axios.get(url);
      console.log(res.data.data.length, "url");
      setColumns(res.data.meta.slice(2));
      setLogs(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const geLogWithSearch = async () => {
    const data = queryOptions.map((item) => {
      return `${item.option} ${item.name}${item.conjunction}'${item.inputVal}'`;
    });
    console.log(data);
    try {
      let url = `http://logstore.sandboxing.tech/?database=azercell&query=SELECT * FROM azercell.${selected} WHERE (TIMESTAMP >= toDateTime('${moment(
        fromDate
      ).format(
        "YYYY-MM-DD HH:mm:ss"
      )}')) AND (TIMESTAMP <= toDateTime('${moment(toDate).format(
        "YYYY-MM-DD HH:mm:ss"
      )}')) ${data.map((item) => item).join(" ")} LIMIT ${limit} FORMAT JSON`;
      console.log(url);
      const res = await axios.get(url);
      console.log(res.data.data.length, "url");
      setColumns(res.data.meta.slice(2));
      setLogs(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // GEt Data for dropdown
  const getColumns = async () => {
    try {
      let url =
        "http://logstore.sandboxing.tech/?database=azercell&query=show%20tables%20like%20%27srv_%25%27%20FORMAT%20JSON";
      const res = await axios.get(url);
      setDrop(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let a = columns.map((data) => {
      return { value: data.name, label: data.name };
    });
    setSelectorOption(a);
  }, [columns]);
  useEffect(() => {
    getColumns();
  }, []);

  const createQuery = (val, actions) => {
    let queryClone = [...queryOptions];
    if (actions.action === "select-option") {
      val.map((data) => {
        let index = queryClone.findIndex((item) => item.name === data.value);
        if (index === -1) {
          queryClone.push({
            name: data.label,
            option: "AND",
            conjunction: "=",
            inputVal: "",
          });
        }
        setQueryOptions(queryClone);
      });
    } else if (actions.action === "remove-value") {
      let filteredQuery = queryClone.filter(
        (data) => data.name !== actions.removedValue.value
      );
      setQueryOptions(filteredQuery);
    } else if (actions.action === "clear") {
      setQueryOptions([]);
    }
    setSelectedSelectorOption(val);
  };

  const setQueryParams = (val, index, name) => {
    let filteredQuery = [...queryOptions];
    filteredQuery[index] = { ...filteredQuery[index], [name]: val };
    setQueryOptions(filteredQuery);
  };

  // Modal
  const handleClose = () => setShow(false);
  const handleShow = (key) => {
    setShow(true);
    setShowKey(key);
  };
  const keyDownload = (content, fileName, contentType) => {
    const a = document.createElement("a");
    const file = new Blob([JSON.parse(content)], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  };

  const downloadDataInCsv = () => {
    var data = [];
    var rows = document.querySelectorAll("table.down tr");

    for (var i = 0; i < rows.length; i++) {
      var row = [],
        cols = rows[i].querySelectorAll("td, th");

      for (var j = 0; j < cols.length; j++) {
        row.push(cols[j].innerText);
      }

      data.push(row.join(","));
    }

    const a = document.createElement("a");
    const file = new Blob([data.join("\n")], { type: "text/csv" });
    a.href = URL.createObjectURL(file);
    a.download = "Data.csv";
    a.click();
  };

  useEffect(() => {
    setError(moment(toDate).isAfter(fromDate));
  }, [toDate]);
  return (
    <div>
      <HeaderNav />
      <div
        style={{ borderRadius: "6px", boxShadow: " 0 0 2px #94949499" }}
        className="inner-banner bg-light mx-4 "
      >
        <div className="d-flex flex-wrap justify-content-between mb-4">
          {/* Dropdown */}
          <div class="col-sm-3 mb-3">
            <label for="select_srv" class="form-label">
              Select
            </label>
            <select
              id="select_srv"
              class="form-select"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              <option value="">Select</option>
              {drop.map((d, i) => {
                return (
                  <option key={i} value={d.name}>
                    {d.name}
                  </option>
                );
              })}
            </select>
          </div>
          {/* Form */}
          <div className="col-sm-3 mb-3">
            <label for="from_date" class="form-label">
              From
            </label>
            <input
              id="from_date"
              type="date"
              className="form-control"
              value={moment(fromDate).format("YYYY-MM-DD")}
              onChange={(e) => {
                setFromDate(e.target.value);
                console.log(e.target.value);
              }}
            />
          </div>
          {/* TO */}
          <div className="col-sm-3  mb-3">
            <label for="to_date" class="form-label">
              To
            </label>
            <input
              type="date"
              id="to_date"
              className="form-control"
              value={moment(toDate).format("YYYY-MM-DD")}
              onChange={(e) => {
                setToDate(e.target.value);
                // console.log(e.target.value);
              }}
            />
            {moment(toDate).isAfter(fromDate) ? "" : ""}
          </div>
          {queryOptions.length === 0 ? (
            <Button
              variant="danger"
              className="form-input-group col-sm-2 mb-3 align-self-end"
              disabled={selected ? false : true}
              onClick={geLog}
            >
              Submit
            </Button>
          ) : (
            ""
          )}

          {/* SearchBar */}
          {/* <div className="">
            <span>Search</span>
            <input type="number" value={search} onChange={(e) => { setSearch(e.target.value); console.log(e.target.value) }} placeholder="enter MSI" />
          </div> */}
        </div>

        {/* Query Section */}
        <div>
          {columns.length === 0 ? (
            ""
          ) : (
            <div
              style={{
                backgroundColor: "white",
                border: "1px solid lightgray",
                borderRadius: "10px",
                padding: "10px 15px",
                boxShadow: " 0 0 1px #94949499",
              }}
            >
              <label class="form-label">Select Query</label>
              <Select
                className="mb-3 col-sm-3"
                isMulti
                options={selectorOption}
                value={selectedSelectorOption}
                onChange={createQuery}
              />
              {queryOptions.length > 0 && (
                <>
                  <Table bordered responsive>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Option</th>
                        <th>Conjunction</th>
                        <th>Input</th>
                      </tr>
                    </thead>
                    <tbody style={{ backgroundColor: "white" }}>
                      {queryOptions.map((data, i) => {
                        return (
                          <tr key={i}>
                            <th className="">{data.name}</th>
                            <td>
                              <select
                                className="form-select "
                                value={data.option}
                                onChange={(e) =>
                                  setQueryParams(e.target.value, i, "option")
                                }
                              >
                                <option value="AND">AND</option>
                                <option value="OR">OR</option>
                              </select>
                            </td>
                            <td>
                              <select
                                className="form-select"
                                value={data.conjunction}
                                onChange={(e) =>
                                  setQueryParams(
                                    e.target.value,
                                    i,
                                    "conjunction"
                                  )
                                }
                              >
                                <option value="=">Equal</option>
                                <option value="<">Less</option>
                                <option value=">">Greater</option>
                                <option value=">=">Greater Than</option>
                                <option value="<=">Less than</option>
                                <option value="!=">Not Equal</option>
                              </select>
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control "
                                value={data.inputVal}
                                placeholder={`Enter ${data.name}`}
                                onChange={(e) =>
                                  setQueryParams(e.target.value, i, "inputVal")
                                }
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                  <div className="d-flex justify-content-end">
                    <Button
                      className="align-self-center col-md-2"
                      variant="danger"
                      onClick={geLogWithSearch}
                    >
                      Submit
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Limit & Download */}
        <div className="d-flex my-3 justify-content-between ">
          <div className="col-sm-3">
            <label for="limit" class="form-label">
              Limit
            </label>
            <select
              id="limit"
              value={limit}
              className="form-select"
              onChange={(e) => setLimit(e.target.value)}
            >
              <option value="10">10</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          {logs.length > 0 && (
            <Button
              variant="danger"
              className="form-input-group col-sm-2  align-self-end"
              disabled={selected ? false : true}
              onClick={downloadDataInCsv}
            >
              Download Data
            </Button>
          )}
        </div>
        {/* Table Log data */}
        {columns.length === 0 ? (
          ""
        ) : (
          <>
            <Table
              id="down"
              className="table down table-responsive"
              bordered
              responsive
            >
              <thead>
                <tr>
                  {columns.map((e, i) => {
                    return <th key={i}>{e.name}</th>;
                  })}
                </tr>
              </thead>
              {logs.length === 0 ? (
                ""
              ) : (
                <tbody style={{ backgroundColor: "white" }}>
                  {logs.map((e, i) => {
                    return (
                      <tr key={i}>
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
                        <td>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => handleShow(e.KEYS)}
                          >
                            View Key
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              )}
            </Table>
            {logs.length === 0 ? <div style={{backgroundColor:"white" ,padding:"10px" ,width:"100%",textAlign:"center"}}> <img src="/images/data-not-found.jpg"/> </div> : ""}
          </>
        )}

        {/* Modal */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Download key</Modal.Title>
          </Modal.Header>
          <Modal.Body>{showKey}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                keyDownload(
                  JSON.stringify(showKey),
                  "json-file-name.json",
                  "text/plain"
                )
              }
            >
              Download
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Home;
