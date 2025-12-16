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
      <div className='container w-25 b-2'>
        <form action="" onSubmit={handleSubmit} className='form p-4 border rounded'>
          <h4>Test Entry</h4>
          <div className="mb-2 ">
            <label htmlFor="" className='form-label'>Firstname</label>
            <input type="text" className='form-control' name="firstname" value={user.firstname} onChange={inputHandler} />
          </div>
          <div className="mb-2">
            <label htmlFor="" className='form-label'>Lastname</label>
          <input type="text" className='form-control' name="lastname" value={user.lastname} onChange={inputHandler} />
          </div>
          <div className="mb-2">
            <label htmlFor="" className='form-label'>Email</label>
          <input type="text" className='form-control' s name="email" value={user.email} onChange={inputHandler} />
          </div>
          <button className='btn btn-primary '>Submit</button>

        </form>
      </div>
    </>
  )
}

export default Testentry