import React, { useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { API_PATH } from "../config";

export default function AddVideo() {
  const [buttonLoader, setButtonLoader] = useState(false);
  const videoRef = useRef(null);

  const LoginSchema = Yup.object().shape({
    videoFile: Yup.string().required("required"),
  });

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];

    if (file) {
      const videoURL = URL.createObjectURL(file);
      console.log("videoRef.current::: ", videoRef.current);
      videoRef.current.src = videoURL;
      videoRef.current.play();
      //   setVideoSource(videoURL);
    }
  };
  return (
    <div>
      {" "}
      <Formik
        initialValues={{
          videoFile: null,
        }}
        validationSchema={LoginSchema}
        onSubmit={(values) => {
          console.log("values::: ", values.videoFile);
          let img1FormData = new FormData();
          img1FormData.append("file", values.videoFile);
          axios
            .post(`${API_PATH}/uploadVideo`, img1FormData)
            .then((res) => {
              console.log("update :::", res.data);
              alert("Upload Successfully");
            })
            .catch((err) => {
              console.log("update err :::", err);
            });
        }}
      >
        {({ touched, errors, isSubmitting, values, setFieldValue }) => (
          <div>
            <Form>
              <div className="form-group">
                <label htmlFor="password">Upload Video</label>
                <input
                  type="file"
                  name="videoFile"
                  onChange={(event) => {
                    handleFileChange(event);
                    setFieldValue("videoFile", event.currentTarget.files[0]);
                    console.log("::: ", event.target.files[0]);
                  }}
                  className={`mt-2 form-control
                          ${
                            touched.videoFile && errors.videoFile
                              ? "is-invalid"
                              : ""
                          }`}
                />
                <ErrorMessage
                  component="div"
                  name="videoFile"
                  className="invalid-feedback"
                />
              </div>
              {/* {console.log("values.file::: ", values.file)} */}
              {console.log("videoRef::: ", videoRef)}

              <div className="d-flex">
                <button
                  style={{ width: "100px" }}
                  type="submit"
                  className="btn btn-primary btn-block mt-4 mr-2"
                  disabled={buttonLoader}
                >
                  <div
                    className="d-flex"
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      className="d-flex"
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <b>Submit</b>
                    </div>
                    {buttonLoader && (
                      <div>
                        <div
                          class="spinner-border ml-2 mt-1"
                          role="status"
                          style={{ height: "20px", width: "20px" }}
                        ></div>
                      </div>
                    )}
                  </div>
                </button>
              </div>
            </Form>
          </div>
        )}
      </Formik>
      <p class="my-2">
        Note : Only preview video, you can show subtitle in add subtitle tab
      </p>
      <div className="mt-4">
        {videoRef && (
          <video
            controls
            width="400px"
            ref={videoRef}
            onEnded={() => {
              if (videoRef.current) {
                videoRef.current.pause();
                URL.revokeObjectURL(videoRef.current.src);
              }
            }}
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
}
