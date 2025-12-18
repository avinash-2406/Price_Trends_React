import React, { useState } from 'react'

function Testentry() {
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: ""
  })

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/testentry/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });

      const data = await response.json();
      console.log(data);
      alert("Data submitted successfully");

      // Clear form
      setUser({
        firstname: "",
        lastname: "",
        email: ""
      });

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <>
      <div className='container w-25 vh-100 d-flex align-items-center justify-content-center'>
        <form action="" onSubmit={handleSubmit} className='form p-1 border rounded d-flex flex-column  w-100 align-items-center'>
          <h4 className='p-2'>Test Entry</h4>
          <div className="mb-2 p-1">
            <label htmlFor="" className='form-label'>Firstname</label>
            <input type="text" className='form-control w-100' name="firstname" value={user.firstname} onChange={inputHandler} />
          </div>
          <div className="mb-2">
            <label htmlFor="" className='form-label'>Lastname</label>
          <input type="text" className='form-control' name="lastname" value={user.lastname} onChange={inputHandler} />
          </div>
          <div className="mb-2">
            <label htmlFor="" className='form-label'>Email</label>
          <input type="text" className='form-control' s name="email" value={user.email} onChange={inputHandler} />
          </div>
          <div className="mt-2 border w-40 ">
            <button className='btn btn-primary w-100'>Submit</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Testentry