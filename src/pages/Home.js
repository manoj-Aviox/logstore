import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import axios from "axios";
import moment from "moment";
import { Modal, Button } from "react-bootstrap";
import HeaderNav from "../components/Header";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import dataNotFound from "../Images/data-not-found.jpg";
import Select from "react-select";

// Baseurl
const Baseurl = process.env.REACT_APP_BASE_URL;

// Days Limit
const Days = parseInt(process.env.REACT_APP_DAYS_LIMIT);

const Home = () => {
  // Date-Picker's state
  const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DDT00:00"));
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DDT23:59"));

  // Select Server
  const [selected, setSelected] = useState();

  // Limit
  const [limit, setLimit] = useState("10");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [keyData, setKeyData] = useState();

  // show rows and elapsed time
  const [showRowsElapsed, setShowRowsElapsed] = useState();

  // Table
  const [columns, setColumns] = useState([]);
  const [duplicate, setDuplicate] = useState([]);
  const [logs, setLogs] = useState([]);

  // Submit Button
  const [withSearch, setWithSearch] = useState(false);
  const [advance, setAdvance] = useState(false);

  // Dropdown
  const [drop, setDrop] = useState([]);
  const [queryOptions, setQueryOptions] = useState([
    {
      name: "",
      option: "AND",
      conjunction: "=",
      inputVal: "",
    },
  ]);

  // Server  Dropdown's Option

  const serverOptions = drop.map((item, index) => {
    return { label: item.name, value: item.name };
  });

  const handleServerChange = (event) => {
    setSelected(event);
  };

  // Additional
  const header = {
    headers: {
      origin: "iam.sandboxing.tech",
    },
  };
  const cors = "add_http_cors_header=1";

  useEffect(() => {
    getColumns();
  }, []);
  useEffect(() => {
    if (selected) {
      getLog(false);
    }
  }, [selected]);

  // GEt Data for dropdown
  const getColumns = async () => {
    try {
      let url = `${Baseurl}?database=azercell&${cors}&query=show%20tables%20like%20%27srv_%25%27%20FORMAT%20JSON`;
      const res = await axios.get(url, header);
      res.data && setDrop(res.data.data);
    } catch (error) {}
  };

  // GetLog Function
  const getLog = async (check) => {
    if (difference >= Days) {
      alert(`Don't fetch data more than ${Days} Days`);
    } else {
    try {
      let url = `${Baseurl}?database=azercell&${cors}&query=SELECT * FROM azercell.${selected.value}  LIMIT ${limit} FORMAT JSON`;

      let url2 = `${Baseurl}?database=azercell&${cors}&query=SELECT * FROM azercell.${
        selected.value
      } WHERE (TIMESTAMP >= toDateTime('${moment(fromDate).format(
        "YYYY-MM-DD HH:mm:ss"
      )}')) AND (TIMESTAMP <= toDateTime('${moment(toDate).format(
        "YYYY-MM-DD HH:mm:ss"
      )}')) LIMIT ${limit} FORMAT JSON`;

      let mainUrl = check !== false ? url2 : url;
      const res = await axios.get(mainUrl, header);
      setShowRowsElapsed(res.data);
      setColumns(res.data.meta.slice(2));
      check === false ? setLogs([]) : setLogs(res.data.data);
    } catch (error) {}
    }
  };

  // GetLog WithSearch Function
  const getLogWithSearch = async () => {
    const data = queryOptions.map((item) => {
      return `${item.option} ${item.name}${item.conjunction}'${item.inputVal}'`;
    });

    try {
      let url = `${Baseurl}?database=azercell&${cors}&query=SELECT * FROM azercell.${
        selected.value
      } WHERE (TIMESTAMP >= toDateTime('${moment(fromDate).format(
        "YYYY-MM-DD HH:mm:ss"
      )}')) AND (TIMESTAMP <= toDateTime('${moment(toDate).format(
        "YYYY-MM-DD HH:mm:ss"
      )}')) ${data.map((item) => item).join(" ")} LIMIT ${limit} FORMAT JSON`;

      const res = await axios.get(url, header);
      setShowRowsElapsed(res.data);
      res.data && setColumns(res.data.meta.slice(2));
      res.data && setLogs(res.data.data);
    } catch (error) {}
  };

  // Make Query Section
  const addTableRows = (index) => {
    const arr = [...queryOptions];
    const rowsInput = {
      name: "",
      option: "AND",
      conjunction: "=",
      inputVal: "",
    };
    arr.splice(index + 1, 0, rowsInput);
    setQueryOptions(arr);
  };
  const deleteTableRows = (index) => {
    const rows = [...queryOptions];
    rows.splice(index, 1);
    setQueryOptions(rows);
    setDuplicate(rows.map((data) => data.name));
  };
  const setQueryParams = (val, index, name) => {
    let filteredQuery = [...queryOptions];
    filteredQuery[index] = { ...filteredQuery[index], [name]: val };
    setQueryOptions(filteredQuery);
    if (name === "name") {
      setDuplicate(filteredQuery.map((data) => data.name));
    }
  };

  // Modal
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (key) => {
    setShowModal(true);
    setKeyData(key);
  };
  const keyDownload = (content, fileName, contentType) => {
    const anchorElement = document.createElement("a");
    const file = new Blob([JSON.parse(content)], { type: contentType });
    anchorElement.href = URL.createObjectURL(file);
    anchorElement.download = fileName;
    anchorElement.click();
  };
  const downloadDataInCsv = () => {
    var data = [];
    var rows = document.querySelectorAll("table.down tr");

    for (var i = 0; i < rows.length; i++) {
      var row = [],
        cols = rows[i].querySelectorAll("td, th");
      for (var j = 0; j < cols.length; j++) {
        if (cols[j].innerText === "View Key") {
          logs.map((val, index) => {
            row.push(val.KEYS);
          });
        }
        row.push(cols[j].innerText);
      }

      data.push(row.join(","));
    }

    const anchorElement = document.createElement("a");
    const file = new Blob([data.join("\n")], { type: "text/csv" });
    anchorElement.href = URL.createObjectURL(file);
    anchorElement.download = "Data.csv";
    anchorElement.click();
  };

  // Disable submit button
  useEffect(() => {
    const data = queryOptions.every((item) => {
      return item.name !== "" && item.inputVal !== "";
    });
    setWithSearch(data);
  }, [queryOptions]);

  // To iterate dynamic tablebody data
  function isJson(str) {
    try {
      var parsed = JSON.parse(str);
      if (Number.isInteger(parsed)) {
        return false;
      }
    } catch (e) {
      return false;
    }
    return true;
  }

  // Difference two dates
  const difference = moment(toDate).diff(moment(fromDate), "days");
  console.log(difference);

  return (
    <div>
      <HeaderNav />
      <div
        style={{ borderRadius: "6px", boxShadow: " 0 0 2px #94949499" }}
        className="inner-banner bg-light mx-4 mb-3"
      >
        {/* Dropdown */}
        <div className="col-sm-3 mb-3">
          <label htmlFor="select_srv" className="form-label">
            Services
          </label>

          <Select options={serverOptions} onChange={handleServerChange} />
        </div>

        {/* Query Section */}
        {columns.length > 0 && (
          <div
            style={{
              backgroundColor: "white",
              border: "1px solid lightgray",
              borderRadius: "10px",
              padding: "10px 15px",
              boxShadow: " 0 0 1px #94949499",
            }}
          >
            <div className="d-flex flex-wrap  mb-4">
              {/* From */}
              <div className="col-sm-3 mb-2 me-5">
                <label htmlFor="from_date" className="form-label">
                  From
                </label>
                <input
                  id="from_date"
                  type="datetime-local"
                  className="form-control"
                  value={moment(fromDate).format("YYYY-MM-DDTHH:mm")}
                  onChange={(item) => {
                    moment(item.target.value).isBefore(toDate) &&
                      setFromDate(item.target.value);
                  }}
                />
              </div>
              {/* TO */}
              <div className="col-sm-3 me-5 mb-2">
                <label htmlFor="to_date" className="form-label">
                  To
                </label>
                <input
                  type="datetime-local"
                  id="to_date"
                  className="form-control"
                  value={moment(toDate).format("YYYY-MM-DDTHH:mm")}
                  onChange={(item) => {
                    moment(item.target.value).isAfter(fromDate) &&
                      setToDate(item.target.value);
                  }}
                />
              </div>

              {/* limit */}
              <div style={{ width: "80px" }} className="me-5 mb-2">
                <label htmlFor="limit" className="form-label">
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
              {/* Advance Filter */}
              <div className="col-sm-3  align-self-end mb-2">
                <Button
                  onClick={() => setAdvance(!advance)}
                  className="w-100 "
                  variant="secondary"
                >
                  Advance Filter
                </Button>
              </div>
            </div>
            {advance && (
              <Table bordered responsive>
                <thead>
                  <tr>
                    <th>Metadata</th>
                    <th>Operator</th>
                    <th>Comparison Operator </th>
                    <th>Value</th>
                    <th className="text-center">
                      {/* <FaPlus cursor="pointer" onClick={addTableRows}/> */}
                      {/* <Button>Add</Button> */}
                    </th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: "white" }}>
                  {queryOptions.map((data, index) => {
                    return (
                      <tr key={index}>
                        {/* Meta */}
                        <td>
                          <select
                            name={data.name}
                            className="form-select mb-148"
                            value={data.name}
                            required
                            onChange={(e) =>
                              setQueryParams(e.target.value, index, "name")
                            }
                          >
                            <option value="">Select Meta</option>
                            {columns.map((col, i) => {
                              return (
                                <option
                                  key={i}
                                  disabled={duplicate.includes(col.name)}
                                  className="col-sm-2"
                                  value={col.name}
                                >
                                  {col.name}
                                </option>
                              );
                            })}
                          </select>
                        </td>
                        {/* Option */}
                        <td>
                          {index !== 0 && (
                            <select
                              name={data.option}
                              className="form-select mb-148"
                              value={data.option}
                              required
                              onChange={(e) =>
                                setQueryParams(e.target.value, index, "option")
                              }
                            >
                              <option value="AND">AND</option>
                              <option value="OR">OR</option>
                            </select>
                          )}
                        </td>
                        {/* Conjuntion */}
                        <td>
                          <select
                            name={data.conjunction}
                            className="form-select mb-148"
                            required
                            value={data.conjunction}
                            onChange={(e) =>
                              setQueryParams(
                                e.target.value,
                                index,
                                "conjunction"
                              )
                            }
                          >
                            <option value="=">Equal</option>
                            <option value="<">Less Than</option>
                            <option value=">">Greater Than</option>
                            <option value=">=">Greater Than Equal To</option>
                            <option value="<=">Less than Equal To</option>
                            <option value="!=">Not Equal</option>
                          </select>
                        </td>
                        {/* Input */}
                        <td>
                          <input
                            name={data.inputVal}
                            type="text"
                            required
                            className="form-control mb-148"
                            value={data.inputVal}
                            placeholder="value"
                            onChange={(e) =>
                              setQueryParams(e.target.value, index, "inputVal")
                            }
                          />
                        </td>
                        <td className="text-center">
                          {/* Add ROw */}
                          <FaPlus
                            cursor="pointer"
                            onClick={() => addTableRows(index)}
                          />
                          {/* Delete Row */}
                          {queryOptions.length !== 1 && (
                            <FaTrashAlt
                              cursor="pointer"
                              style={{ marginLeft: "8px" }}
                              onClick={() => deleteTableRows(index)}
                            />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
            {/* Submit Button & Limit */}
            <div className="d-flex  justify-content-end">
              <Button
                className="align-self-end col-md-2"
                variant="danger"
                disabled={advance && !withSearch && true}
                onClick={withSearch && advance ? getLogWithSearch : getLog}
              >
                Submit
              </Button>
            </div>
          </div>
        )}

        {/* Table Log data */}
        {columns.length !== 0 && (
          <>
            <div className="d-flex my-3 justify-content-between align-items-center ">
              {/*  Showing rows count and elapsed time from api response */}
              <div>
                About {showRowsElapsed && showRowsElapsed.rows} rows ({" "}
                {showRowsElapsed && showRowsElapsed.statistics.elapsed} elapsed
                ){" "}
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
                <tbody>
                  <tr>
                    <td
                      colSpan={columns.length}
                      style={{
                        backgroundColor: "white",
                        padding: "10px",
                        width: "100%",
                        textAlign: "center",
                      }}
                    >
                      <img src={dataNotFound} alt="Not found" />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody
                  className="downTable"
                  style={{ backgroundColor: "white" }}
                >
                  {logs.map((item, index) => {
                    return (
                      <tr key={index}>
                        {Object.values(item)
                          .slice(2)
                          .map((val) => {
                            return (
                              <td>
                                {isJson(val) === true ? (
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => handleShowModal(val)}
                                  >
                                    View Key
                                  </button>
                                ) : (
                                  val
                                )}
                              </td>
                            );
                          })}
                      </tr>
                    );
                  })}
                </tbody>
              )}
            </Table>
          </>
        )}

        {/* Modal */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Download key</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <code>{keyData}</code>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                keyDownload(
                  JSON.stringify(keyData),
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
