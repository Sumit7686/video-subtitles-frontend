import React from "react";

export default function Navbar({ setSidebarShow, sidebarShow }) {
  return (
    <div>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid d-flex justify-content-space-evenly">
          <button
            type="button"
            id="sidebarCollapse"
            class="btn btn-info"
            onClick={() => {
              setSidebarShow(!sidebarShow);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-list-nested"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M4.5 11.5A.5.5 0 0 1 5 11h10a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5m-2-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m-2-4A.5.5 0 0 1 1 3h10a.5.5 0 0 1 0 1H1a.5.5 0 0 1-.5-.5"
              />
            </svg>
          </button>
          <p>
            {window.location.pathname.split("/")[1] === "" && <>Video Upload</>}
            {window.location.pathname.split("/")[1] === "addsubtitle" && (
              <>Add Subtitle</>
            )}
          </p>
        </div>
      </nav>
    </div>
  );
}
