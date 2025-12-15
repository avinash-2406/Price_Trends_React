import React,{ useState } from 'react'

function Testentry() {
    const [user,setUser] = useState({
        firstname:"",
        lastname:"",
        email:""
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
        <div>
            <form action="" onSubmit={handleSubmit}>
                <label htmlFor="">Firstname</label>
                <input type="text" name="firstname" value={user.firstname} onChange={inputHandler} />
                <br />
                <label htmlFor="">Lastname</label>
                <input type="text" name="lastname" value={user.lastname} onChange={inputHandler} />
                <br />
                <label htmlFor="">Email</label>
                <input type="text" name="email" value={user.email} onChange={inputHandler} />
                <br />
                <button>Submit</button>

            </form>
        </div>
    </>
  )
}

export default Testentry