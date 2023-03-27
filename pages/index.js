import Image from "next/image";
import Modal from "@/components/modal";
import Card from "@/components/card";
import Login from "@/components/login";
import Alert from "@/components/alert";
import { useEffect, useState } from "react";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [noteShowModal, setnoteShowModal] = useState(false);
  const [loginShowModal, setLoginShowModal] = useState(false);
  const [modalValue, setModalValue] = useState({});
  const [showAlert, setShowAlert] = useState(true);
  const [alertValue, setAlertValue] = useState({
    title: "Tip",
    msg: "Login to save ours notes and have a Backup",
  });
  const [loginStatus, setloginStatus] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email !== "null") {
      setloginStatus(false);
      fetchNotes(email);
    }
  }, []);

  const fetchNotes = async (email) => {
    const response = await fetch(`/api/note?email=${email}`);
    const stroredNotes = await response.json();
    setNotes([...stroredNotes]);
  };

  const handleNoteClick = () => {
    setModalValue({ key: null, title: "", note: "" });
    setnoteShowModal(true);
  };

  const handleLoginClick = () => {
    setLoginShowModal(true);
  };

  const handleLogoutClick = () => {
    setloginStatus(true);
    localStorage.setItem("email", null);
    setNotes([]);
  };

  const handleDeleteClick = async (key) => {
    const email = localStorage.getItem("email");
    setNotes(notes.filter((note) => note.key != key));
    setnoteShowModal(false);
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key, email }),
    };
    await fetch(`/api/note?email:${email}`, options);
  };

  const handleSaveClick = async (title, note, key) => {
    setnoteShowModal(false);
    const email = localStorage.getItem("email");
    if (key == null) {
      key = notes.length;
      if (email) {
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, note, key, email }),
        };
        await fetch("/api/note", options);
      }
      setNotes([...notes, { title, note, key }]);
    } else {
      if (email) {
        const options = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, note, key, email }),
        };
        await fetch("/api/note", options);
      }
      const newValues = { title, note, key };
      setNotes((prevList) =>
        prevList.map((item) => {
          if (item.key === key) {
            return { ...item, ...newValues };
          } else {
            return item;
          }
        })
      );
    }
  };

  const handleCardClick = (data) => {
    setModalValue(data);
    setnoteShowModal(true);
  };

  const handleLoginSubmit = async (email, password) => {
    setLoginShowModal(false);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    };
    try {
      const response = await fetch("/api/user", options);
      if (!response.ok) {
        setAlertValue({ title: "Failed", msg: "Login Failed" });
        setShowAlert(true);

        return;
      }
      const json = await response.json();
      fetchNotes(json.email);
      setAlertValue({ title: "Success", msg: "Login successful" });
      setShowAlert(true);
      setloginStatus(false);
      localStorage.setItem("email", json.email);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      {/* Navbar Start */}

      <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900">
        <div className="container flex flex-wrap items-center justify-between mx-auto">
          <a href="https://flowbite.com/" className="flex items-center">
            <Image
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-6 mr-3 sm:h-9"
              alt="notepad Logo"
              width={30}
              height={30}
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              NotePad
            </span>
          </a>
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <a
                  href="#"
                  className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  onClick={handleNoteClick}
                >
                  New Note
                </a>
              </li>
              <li>
                {loginStatus ? (
                  <a
                    href="#"
                    className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                    onClick={handleLoginClick}
                  >
                    Login
                  </a>
                ) : (
                  <a
                    href="#"
                    className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                    onClick={handleLogoutClick}
                  >
                    Log out
                  </a>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Navbar End */}
      {/* Row Col to manage card layout Start */}
      <div className="row" style={{ padding: 10 }}>
        {/* New note card */}
        <div className="col-3">
          <div className="card" onClick={handleNoteClick}>
            <div className="card-body d-flex justify-content-center">
              <Image src="/plus.png" alt="plus" width="150" height="200" />
              <br />
            </div>
          </div>
        </div>

        {/* New note card */}
        {/* Saved Cards */}
        {notes.length > 0
          ? notes.map((note) => (
              <Card values={note} key={note.key} onClick={handleCardClick} />
            ))
          : null}
      </div>
      {/* Row Col to manage card layout End*/}
      {/* Modals*/}
      {noteShowModal ? (
        <Modal
          onClose={() => setnoteShowModal(false)}
          onSave={handleSaveClick}
          onDelete={handleDeleteClick}
          values={modalValue}
        />
      ) : null}
      {loginShowModal ? (
        <Login
          onClose={() => setLoginShowModal(false)}
          onLogin={handleLoginSubmit}
        />
      ) : null}
      {showAlert ? (
        <Alert onClose={() => setShowAlert(false)} values={alertValue} />
      ) : null}
    </div>
  );
}
