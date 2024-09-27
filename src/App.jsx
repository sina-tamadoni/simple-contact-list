import { useEffect, useState } from "react";
import { v4 } from "uuid";

import "./App.css";

function App() {
  const [contacts, setContacts] = useState([]);
  const [contact, setContact] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  function changeHandler(e) {
    setContact((prevContact) => ({
      ...prevContact,
      [e.target.name]: e.target.value,
    }));
  }
  function saveHandler() {
    const pattern = "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}";
    const regexPattern = new RegExp(pattern);

    let validationErrors = {};
    if (contact.name.trim() === "" || contact.name == null) {
      validationErrors.nameErr = "This field is required";
    } else if (contact.name.length < 3) {
      validationErrors.nameErr =
        "The entered name must be more than 2 characters";
    }
    if (contact.phone.trim() === "" || contact.phone == null) {
      validationErrors.phoneErr = "This field is required";
    } else if (contact.phone.length > 11) {
      validationErrors.phoneErr =
        "The entered number must be a maximum of 11 digits";
    }
    if (contact.email.trim() === "" || contact.email == null) {
      validationErrors.emailErr = "This field is required";
    } else if (!contact.email.match(regexPattern)) {
      validationErrors.emailErr = "Please enter a valid email address";
    }
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      const newContact = { ...contact, id: v4() };
      setContacts((prevContacts) => [...prevContacts, newContact]);
      setContact({
        name: "",
        phone: "",
        email: "",
      });
      fetch("http://localhost:3000/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContact),
      });
    }
  }
  function deleteHandler(id) {
    fetch(`http://localhost:3000/contacts/${id}`, {
      method: "DELETE",
    });
  }
  useEffect(() => {
    fetch("http://localhost:3000/contacts")
      .then((res) => res.json())
      .then((data) => (data.length ? setContacts(data) : setContacts([])));
  }, [contacts]);

  return (
    <div className="container">
      <div className="formContainer">
        <input
          type="text"
          name="name"
          value={contact.name}
          onChange={changeHandler}
          placeholder="name"
        />
        {errors.nameErr && <div className="error">{errors.nameErr}</div>}
        <input
          type="number"
          name="phone"
          value={contact.phone}
          onChange={changeHandler}
          placeholder="phone"
        />
        {errors.phoneErr && <div className="error">{errors.phoneErr}</div>}

        <input
          type="text"
          name="email"
          value={contact.email}
          onChange={changeHandler}
          placeholder="email"
        />
        {errors.emailErr && <div className="error">{errors.emailErr}</div>}
        <button onClick={saveHandler}>Save</button>
      </div>
      {!!contacts.length && (
        <table id="contacts">
          <thead>
            <tr>
              <th>Name</th>
              <th>Number</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td>{contact.name}</td>
                <td>{contact.phone}</td>
                <td>{contact.email}</td>
                <td
                  className="delete"
                  onClick={() => deleteHandler(contact.id)}
                >
                  Delete
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
