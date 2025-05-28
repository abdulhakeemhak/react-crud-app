import React, { useEffect, useState } from 'react'
import './Crud.css'

function Crud() {
    const [userDetails, setUserDetails] = useState([]);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [editData, setEditData] = useState(null);
    
    useEffect(()=>{
        fetch('https://jsonplaceholder.typicode.com/users')
        .then((response)=> response.json())
        .then((data)=> setUserDetails(data))
        .catch((err)=> console.log(err))
    },[])

    function handleDelete(id){
        fetch(`https://jsonplaceholder.typicode.com/users/${id}`,{
            method: 'DELETE',
        }).then(()=>setUserDetails(userDetails.filter(previousState => previousState.id !== id)))
    }
    function handleEdit(user){
        setName(user.username)
        setPhone(user.phone)
        setAddress(user.address.city)
        setEditData(user)
    }
    function handleData(){
        const userName = name.trim();
        const userPhone = phone.trim();
        const userAddress = address.trim();

        // setName("");
        // setPhone("");
        // setAddress("");
        
        if(userName && userPhone && userAddress){
            if (editData) {
                fetch(`https://jsonplaceholder.typicode.com/users/${editData.id}`,{
                    method: 'PUT',
                    headers: {
                        "content-type" : "application/json; charset=utf-8",
                    },
                    body: JSON.stringify({
                        username: userName,
                        phone: userPhone,
                        address: {
                            city: userAddress
                        }
                    })
                })
                .then((response)=> response.json())
                .then((updatedData)=> setUserDetails(userDetails.map((user)=> user.id === updatedData.id? updatedData : user)))
            }
            else{
                fetch('https://jsonplaceholder.typicode.com/users',{
                    method:'POST',
                    headers: {
                        "content-type" : "application/json; charset=utf-8",
                    },
                    body: JSON.stringify({
                        username: userName,
                        phone: userPhone,
                        address: {
                            city: userAddress
                        }
                    })
                })
                .then((response)=> response.json())
                .then((newUser)=> setUserDetails([...userDetails, newUser]))
            }
        }
            
    }

  return (
    <div className='crud'>
        <h1>Crud Operations</h1>
        <div>
            <label>Enter User Name</label>
            <input type="text" placeholder='User Name' value={name} onChange={(e)=>setName(e.target.value)}/><br />

            <label>Enter User Phone No</label>
            <input type="text" placeholder='User Phone No' value={phone} onChange={(e)=>setPhone(e.target.value)}/><br />

            <label>Enter User Address</label>
            <input type="text" placeholder='User Address' value={address} onChange={(e)=>setAddress(e.target.value)}/><br />

            <button onClick={handleData}>{editData?'Edit User Data':'Add New Data'}</button><br />
        </div>
        <table border={2}>
            <thead>
                <tr>
                    <th>S No</th>
                    <th>User Name</th>
                    <th>User Phone</th>
                    <th>User Address</th>
                    <th>Update</th>
                </tr>
            </thead>
            <tbody>
    {userDetails.map((user,index)=>{
        return(
            <tr key={user.id}>
                <td>{index+1}</td>
                <td>{user.username}</td>
                <td>{user.phone}</td>
                <td>{user.address.city}</td>
                <td>
                    <button onClick={()=> handleEdit(user)}>Edit</button>
                    <button onClick={()=> handleDelete(user.id)}>Delete</button>
                </td>
            </tr>
        )
    })}
            </tbody>
        </table>
    </div>
  )
}

export default Crud