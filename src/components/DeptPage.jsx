import { Grid, Input, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Complaint from './Complaint'
import ComplaintsList from './ComplaintsList'
import Profile from './Profile'
import RightNav from './RightNav'
import Statistics from './Statistics'

const  DeptPage = () => {
    // get the data from the local storage
    const user = JSON.parse(localStorage.getItem('loginData'))
    const [resolvedComplaints, setResolvedComplaints] = useState([])
    const [unresolvedComplaints, setUnresolvedComplaints] = useState([])
    const [activeComplaint, setActiveComplaint] = useState(false);
    const [statistics, setStatistics] = useState(false);
    const  [res,onRes] = useState(false)
    const  [unres,onUnres] = useState(true)
    const [onSearch , setOnSearch] = useState(false);
    const [onProfile , setOnProfile] = useState(false);
    const [search , setSearch] = useState("");
    
    useEffect(() => {
        //get all the complaints which are send to this user department
        fetch(`https://myconstituencies.onrender.com/complaints/deptComplaints`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {

                console.log(data)
                
                setResolvedComplaints(
                    data.complaints.filter((complaint) => complaint.resolved === true)
                )
                // set the unresolved complaints
                setUnresolvedComplaints(
                    data.complaints.filter((complaint) => complaint.resolved === false)
                )
            }
            )
    },[])

    console.log(resolvedComplaints,unresolvedComplaints);

    const handleRes = () => {
        onRes(true)
        onUnres(false)
        setActiveComplaint(false)
        setStatistics(false)
        setOnSearch(false)
        setOnProfile(false)
    }
    const handleUnres = () => {
        onRes(false)
        onUnres(true)
        setActiveComplaint(false)
        setStatistics(false)
        setOnSearch(false)
        setOnProfile(false)
    }
   

    const handleComplaintClick = (item) => {
     console.log(item)
      setActiveComplaint(item);
      onRes(false)
      onUnres(false)
        setStatistics(false)
        setOnSearch(false)
        setOnProfile(false)
    };

    const handleStatistics = () => {
        setStatistics(true)
        setActiveComplaint(false)
        onRes(false)
        onUnres(false)
        setOnSearch(false)
        setOnProfile(false)
    }
    const handleProfile = () => {

        setOnProfile(true)
        setActiveComplaint(false)
        onRes(false)
        onUnres(false)
        setOnSearch(false)
        setStatistics(false)
    }
  
  let data = [
        ["Complaints", "No.of Complaints"], 
 ];

      
    const options = {
        title: "Complaints Statistics \n"+ user?.department + "- " + user?.district,
        is3D: true,
      };

    data.push(["Resolved",resolvedComplaints.length])
    data.push(["Unresolved",unresolvedComplaints.length])
    console.log(data)
    const [searchedComplaints, setSearchedComplaints] = useState([]);

    useEffect(() => {
     
        const  fetchComplaints = async  () => {
          if (search === "") {
            let complaints = [];
            setSearchedComplaints(complaints);
            return;
          }
          const response = await axios.get(`https://myconstituencies.onrender.com/complaints/dept/search?q=${encodeURIComponent(search)}`, 
          { headers: { authorization: `Bearer ${localStorage.getItem("token")}` }}
        );
  
          const complaints = response.data.complaints;
          console.log(response, " complaints")
          setSearchedComplaints(complaints);
        }
        fetchComplaints();
  
    }, [search]);

    const handleSearch = () => {
      setActiveComplaint(false)
      setStatistics(false)
      onRes(false)
      onUnres(false)
      setOnSearch(true)
      setOnProfile(false)
    }


  return (
    <Grid container xs={12}>
      <Grid item xs={3}>
        <section className="flex gap-6  fixed p-0">
          <RightNav 
            handleRes={handleRes}
            handleUnres={handleUnres}
            handleStatistics = {handleStatistics}
            handleSearch = {handleSearch}
            handleProfile={handleProfile}
          />
        </section>
      </Grid>
        <Grid item xs={9}>
        {onSearch && (
          <>
          <Typography variant="h8" style={{ marginTop: "10px" }}> Search for : </Typography>
        <Input 
        type="text"
        placeholder="Search"
        className="border-2 border-gray-300 rounded-md p-2"
        onChange={(e) => setSearch(e.target.value)}
        value = {search}
        style={{marginTop:"10px"}}

        />
        </>)}
        {onSearch && <ComplaintsList complaints={searchedComplaints}  handleComplaintClick={handleComplaintClick} />}
        {activeComplaint && <Complaint activeComplaint={activeComplaint} />}
                {res && <ComplaintsList complaints={resolvedComplaints}  handleComplaintClick={handleComplaintClick} />}
                {unres && <ComplaintsList complaints={unresolvedComplaints}  handleComplaintClick={handleComplaintClick} />}
        {statistics && <Statistics department = {user?.department} district = {user?.district} data={data} options={options} />}
        {onProfile &&
        <Profile/>}

        </Grid>
      

    </Grid>
  )

}

export default DeptPage