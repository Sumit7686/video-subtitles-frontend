import axios from "axios";
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { Formik, Form, Field, FieldArray } from "formik";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { API_PATH } from "../config";

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <video controls width="100%">
          <source src={props.item?.videoUrl} type="video/mp4" />
          <track
            kind="subtitles"
            src={`data:text/vtt;base64,${btoa(
              props.generateWebVTT(props.item?.subtitles)
            )}`}
            label="English"
          />
        </video>
      </Modal.Body>
      <Modal.Footer>
        <p class="my-2 ">Note : Click in three dot button to show captions</p>
      </Modal.Footer>
    </Modal>
  );
}

export default function AddSubtitle() {
  const [loader, setLoader] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [post, setPost] = useState(null);
  const [modalShow, setModalShow] = React.useState(false);
  const [rowValue, setRowValue] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [preview, setPreview] = useState();

  useEffect(() => {
    getAllData();
  }, [isEdit]);
  const getAllData = () => {
    setLoader(true);
    axios.get(`${API_PATH}/getAllVideos`).then((response) => {
      console.log("response?.data.data::: ", response?.data.data);
      setLoader(false);
      setPost(response?.data.data);
    });
  };

  const generateWebVTT = (item) => {
    let vtt = "WEBVTT\n\n";
    item?.forEach((subtitle) => {
      vtt += `${formatTime(subtitle.startTime)} --> ${formatTime(
        subtitle.endTime
      )}\n${subtitle.text}\n\n`;
    });
    return vtt;
  };
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(2, "0")}.000`;
  };
  return (
    <div>
      {console.log("rowValue::: ", rowValue?.subtitles)}
      {isEdit ? (
        <>
          {console.log(
            "rowValue.length >= 0::: ",
            rowValue.length,
            rowValue.length >= 0
          )}
          <Formik
            initialValues={{
              subtitles:
                rowValue.subtitles.length > 0
                  ? rowValue.subtitles
                  : [{ text: "", startTime: "", endTime: "" }],
            }}
            onSubmit={(values) => {
              setButtonLoader(true);
              console.log("values::: ", values);
              const data = {
                videoId: rowValue?.videoId,
                subtitles: values.subtitles,
              };
              console.log("data::: ", data);
              axios
                .post(`${API_PATH}/addSubtitles`, data)
                .then((res) => {
                  console.log("update :::", res.data);
                  setButtonLoader(false);
                  alert(res.data.message);
                  setIsEdit(false);
                })
                .catch((err) => {
                  console.log("update err :::", err);
                  setButtonLoader(false);
                });
            }}
            render={({ values }) => (
              <Form className="card p-4">
                <label className="my-2">Add Subtitle</label>

                <FieldArray
                  name="subtitles"
                  render={(arrayHelpers) => (
                    <div>
                      {values?.subtitles?.map((subtitles, index) => (
                        <div key={index}>
                          {console.log("subtitles::: ", subtitles)}
                          <Table>
                            {index == 0 && (
                              <thead>
                                <tr>
                                  <th>Text</th>
                                  <th>Start Time(Second)</th>
                                  <th>End Time (Second)</th>
                                  <th colSpan={2}>Action</th>
                                </tr>
                              </thead>
                            )}

                            <tbody>
                              <tr>
                                <td>
                                  {" "}
                                  <Field
                                    placeholder="Text"
                                    name={`subtitles.${index}.text`}
                                    className="form-control mb-2"
                                  />
                                </td>
                                <td>
                                  <Field
                                    type="number"
                                    placeholder="Start Date"
                                    name={`subtitles.${index}.startTime`}
                                    className="form-control mb-2 mx-2"
                                  />
                                </td>
                                <td>
                                  <Field
                                    type="number"
                                    placeholder="End Date"
                                    name={`subtitles.${index}.endTime`}
                                    className="form-control mb-2"
                                  />
                                </td>
                                <td>
                                  <button
                                    disabled={values.subtitles.length == 1}
                                    className="btn btn-danger mx-2"
                                    type="button"
                                    onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                                  >
                                    -
                                  </button>
                                </td>
                                <td>
                                  <button
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={() =>
                                      arrayHelpers.push(index, {
                                        text: "",
                                        startTime: 0,
                                        endTime: 0,
                                      })
                                    } // insert an empty string at a position
                                  >
                                    +
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      ))}
                      <p>Note : Enter second you went to add subtitle</p>
                      <div className="d-flex mt-2">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={buttonLoader}
                        >
                          Submit
                          {buttonLoader && (
                            <span>
                              {" "}
                              <div
                                class="spinner-border ml-2 mt-1"
                                role="status"
                                style={{ height: "20px", width: "20px" }}
                              ></div>
                            </span>
                          )}
                        </button>
                        <button
                          className="btn btn-secondary mx-2"
                          onClick={() => {
                            setIsEdit(!isEdit);
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                />
              </Form>
            )}
          />
        </>
      ) : (
        <>
          <p class="my-2">Note : Click in eye button to show captions</p>
          <Table striped bordered hover responsive variant="light">
            <thead>
              <tr>
                <th>id</th>
                <th>video Preview</th>
                <th>VideoId</th>
                <th>Name</th>
                <th colSpan={3}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loader ? (
                <tr>
                  <td colSpan={5} className="text-center">
                    Loading...
                    {/* <div
                      class="spinner-border ml-2 mt-1"
                      role="status"
                      style={{ height: "20px", width: "20px" }}
                    ></div> */}
                  </td>
                </tr>
              ) : (
                <>
                  {post &&
                    post.map((item, i) => (
                      <tr key={item._id}>
                        <td>{i + 1}</td>
                        <td width="200" height="200">
                          <video width="100%" height="100%" controls>
                            <source src={item.videoUrl} />
                          </video>
                        </td>
                        <td>{item.videoId}</td>
                        <td>{item.videoName}</td>

                        <td>
                          <button
                            className="btn btn-warning"
                            onClick={() => {
                              setIsEdit(!isEdit);
                              setRowValue(item);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              class="bi bi-pencil-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                            </svg>
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-info"
                            onClick={() => {
                              setModalShow(true);
                              setPreview(item);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              class="bi bi-eye-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                              <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                            </svg>
                          </button>
                        </td>
                        {console.log("item.path::: ", item)}
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              const data = prompt("Enter A Delete ");
                              if (data == "Delete") {
                                axios
                                  .post(
                                    `${API_PATH}/delete-video/${item._id}`,
                                    {
                                      path: item.path,
                                    }
                                  )
                                  .then((res) => {
                                    alert(res.data.message);
                                    getAllData();
                                  })
                                  .catch((err) => {
                                    console.log("update err :::", err);
                                  });
                              }
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              class="bi bi-trash"
                              viewBox="0 0 16 16"
                            >
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  {post?.length <= 0 && (
                    <tr>
                      <td colSpan={5} className="text-center">
                        No data found
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </Table>
        </>
      )}

      <MyVerticallyCenteredModal
        show={modalShow}
        item={preview}
        generateWebVTT={generateWebVTT}
        onHide={() => setModalShow(false)}
      />
    </div>
  );
}
