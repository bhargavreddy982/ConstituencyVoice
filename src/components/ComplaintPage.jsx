import { Grid, Input, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Complaint from "./Complaint";
import ComplaintsList from "./ComplaintsList";
import Profile from "./Profile";
import RightNav from "./RightNav";

import axios from "axios";


const ComplaintPage = () => {

  const [resolvedComplaints, setResolvedComplaints] = useState([]);
  const [unresolvedComplaints, setUnresolvedComplaints] = useState([]);



  useEffect(() => {
    const fetchComplaints = async () => {
      console.log("fetch is called")
      const response = await fetch(
        "https://myconstituencies.onrender.com/complaints/sentComplaints",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();

      setResolvedComplaints(
        data.complaints.filter((complaint) => complaint.resolved === true)
      );
      // set the unresolved complaints
      setUnresolvedComplaints(
        data.complaints.filter((complaint) => complaint.resolved === false)
      );

    };



    fetchComplaints();
  }, []);

  const [onInbox, setOnInbox] = useState(true);
  const [onSent, setOnSent] = useState(false);
  const [got, setGot] = useState(false);
  const[profile,setprofile]=useState(false);
  const [res, onRes] = useState(false);
  const [onSearch , setOnSearch] = useState(false);
  const [search , setSearch] = useState("");
  const clickOnInbox = () => {
    setOnInbox(true);
    setOnSent(false);
    setGot(false);
    setprofile(false);
    setActiveComplaint(false);
    onRes(false)
    setOnSearch(false);
  };
  const clickOnSent = () => {
    setOnInbox(false);
    setOnSent(true);
    setGot(false);
    setprofile(false);
    setActiveComplaint(false);
    onRes(false)
    setOnSearch(false);
  };
  const clickOnGot = () => {
    setOnInbox(false);
    setActiveComplaint(false);
    setOnSent(false);
    setGot(true);
    setprofile(false);
    onRes(false)
    setOnSearch(false);
  };
  const clickOnprofile =()=>{
    setOnInbox(false);
    setActiveComplaint(false);
    setOnSent(false);
    setGot(false);
    setprofile(true);
    onRes(false)
    setOnSearch(false);
  }

  const clickOnResolved = () => {
    setOnInbox(false);
    setActiveComplaint(false);
    setOnSent(false);
    setGot(false);
    setprofile(false);
    onRes(true)
    setOnSearch(false);

  };

  const handleSearch = () => {
    setOnSearch(true);
    setActiveComplaint(false);
    setOnInbox(false);
    setOnSent(false);
    setGot(false);
    setprofile(false);
    onRes(false)
  };

  


  const [activeComplaint, setActiveComplaint] = useState(false);

  const resolveComplaint = async (id) => {
    console.log("jjjfjfj",id)
    const response = await fetch(
      `https://myconstituencies.onrender.com/complaints/resolveComplaint/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await response.json();
    console.log(data);
    // set the unresolved complaints to the new list
    setUnresolvedComplaints(
      unresolvedComplaints.filter((complaint) => complaint._id !== id)
    );
    // set the resolved complaints to the new list
    setResolvedComplaints([...resolvedComplaints, data.savedComplaint]);
   
    alert("Complaint resolved");
    
  };


  const handleComplaintClick = (item) => {
    setActiveComplaint(item);
    setOnInbox(false);
    setOnSent(false);
    setGot(false);
    setprofile(false);
    onRes(false)
    setOnSearch(false);
  };

  console.log(onInbox, onSent, got);
  console.log("resolved complaints", resolvedComplaints);
  console.log("unresolved complaints", unresolvedComplaints);
  const [searchedComplaints, setSearchedComplaints] = useState([]);

  useEffect(() => {
   
      const  fetchComplaints = async  () => {
        if (search === "") {
          let complaints = [];
          setSearchedComplaints(complaints);
          return;
        }
        const response = await axios.get(`https://myconstituencies.onrender.com/complaints/search?q=${encodeURIComponent(search)}`, 
        { headers: { authorization: `Bearer ${localStorage.getItem("token")}` }}
      );

        const complaints = response.data.complaints;
        console.log(response, " complaints")
        setSearchedComplaints(complaints);
      }
      fetchComplaints();

  }, [search]);


  return (
    <Grid container xs={12}>
      <Grid item xs={3}>
        <section className="flex gap-6  fixed p-0">
          <RightNav
            clickOnInbox={clickOnInbox}
            clickOnSent={clickOnSent}
            clickOnGot={clickOnGot}
            clickOnprofile={clickOnprofile}
            clickOnResolved={clickOnResolved}
            clickOnSearch={handleSearch}
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
     
        {onSearch && <ComplaintsList complaints = {searchedComplaints}  handleComplaintClick = {handleComplaintClick}/>}

        {activeComplaint && <Complaint activeComplaint={activeComplaint} resolveComplaint={resolveComplaint}/>}

        {onInbox && (
          <ComplaintsList
            complaints={unresolvedComplaints}
            handleComplaintClick={handleComplaintClick}
          />
        )}
        {res && (
          <ComplaintsList
            complaints={resolvedComplaints}
            handleComplaintClick={handleComplaintClick}
          />
        )}
        
        {profile && (
          <Profile/>

        )}
      </Grid>
    </Grid>
  );
};

export default ComplaintPage;
