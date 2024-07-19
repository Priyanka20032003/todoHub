import { useEffect, useState } from 'react';
import { AiFillDelete } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import './App.css';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import { FaRepeat } from "react-icons/fa6";
import sound from './assets/tick.wav'

function App() {
  const [isClicked,setIsClicked]=useState(false);
  const [title,setTitle]=useState("");
  const [des,setDes]=useState("");
  const [taskItems,setTaskItems]=useState([]);
  const [CompletedToDo,setCompletedToDo]=useState([]);
  const [open,setOpen]=useState(false);
  const [index1,setIndex]=useState(0);
  const [editTitle,setEditTitle]=useState("");
  const [editDes,setEditDes]=useState("");
  const [error,setError]=useState({title:"",des:""})
  useEffect(()=>{
    let data=JSON.parse(localStorage.getItem('Task') || '[]');
    let data1=JSON.parse(localStorage.getItem('completed') || '[]');
    if(data){
      setTaskItems(data);
    }
    if(data1){
      setCompletedToDo(data1);
    }
  },[])
  
  const handleChange=(e)=>{
    setTitle(e.target.value);
  }
  const handleTask=()=>{
    if(title.trim().length<3) {
      setError({...error,title:"title should be more than 3 characters"})
    }else if(des.trim().length<10){
      setError({...error,des:"description should be more than 10 characters"})
    }else{
    setError({title:"",des:""})
    const task={title:title,description:des}
    let updatedToDo=[...taskItems];
    updatedToDo.push(task);
    setTaskItems(updatedToDo);
    localStorage.setItem('Task',JSON.stringify(updatedToDo));
    setTitle("");
    setDes("");
    }
  }

  const handleDelete=(index)=>{
      let reducedToDo=[...taskItems];
      reducedToDo.splice(index,1);
      console.log(reducedToDo);
      setTaskItems(reducedToDo);
      localStorage.setItem('Task',JSON.stringify(reducedToDo));
  }
  const handleTick=(index)=>{
    new Audio(sound).play();
    const date = new Date();
    const ist = date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    const mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();
    const day = date.getDay();
    const h = new Date(ist).getHours();
    const m = new Date(ist).getMinutes();
    const sec = new Date(ist).getSeconds();
    const completedOn=day + '-'+mm+'-'+yyyy+'at'+h+':'+m+':'+sec;
    let completedItem={
      ...taskItems[index],completedOn:completedOn
    }
    let temp=[...CompletedToDo];
    temp.push(completedItem);
    setCompletedToDo(temp);
    localStorage.setItem('completed',JSON.stringify(temp));
    handleDelete(index);
    
  }

 const handleCompletedToDoDelete=(index)=>{
  let reducedCompletedToDo=[...CompletedToDo];
  reducedCompletedToDo.splice(index,1);
  setCompletedToDo(reducedCompletedToDo);
  localStorage.setItem('completed',JSON.stringify(reducedCompletedToDo));
 }
 const handleOpen=(index)=>{
  setOpen(true);
  setIndex(index);
  setEditTitle(taskItems[index].title);
  setEditDes(taskItems[index].description)
 }
 const onCloseModal=()=>{
  setOpen(false);
 }

 
 const handleEditTitle=(e)=>{
      setEditTitle(e.target.value);
 }
 const handleEditDes=(e)=>{
  setEditDes(e.target.value);
}
const handleEdit=()=>{
   let updatedObj={title:editTitle,description:editDes}
   taskItems[index1]=updatedObj;
   let updatedArr=[...taskItems];
   localStorage.setItem('Task',JSON.stringify(updatedArr));
  setOpen(false);
 }

 const handleRepeat=(item,index)=>{
  const repeatedArr=[...taskItems];
  repeatedArr.push(item);
  setTaskItems(repeatedArr);
  localStorage.setItem('Task',JSON.stringify(repeatedArr));

  const reducedArr=[...CompletedToDo];
  reducedArr.splice(index,1);
  setCompletedToDo(reducedArr);
  localStorage.setItem('completed',JSON.stringify(reducedArr || []));

 }
  return (
   <div>
      <h1>To do</h1>
      <div className='container'>
        <div className='todo-input'>
          <div className="todo-title">
              <label htmlFor="title">Title: </label>
              <input 
              id='title' 
              type="text" 
              placeholder="Enter title for your work?" 
              value={title} 
              onChange={handleChange}/>
              <div>
               {title.trim().length<3 ? <p className='err'>{error.title}</p>:""}
               </div>
            </div>
           
            <div className="todo-des">
              <label htmlFor="des">Description:</label>
              <input 
              id='des' 
              type="text" 
              placeholder="what Description of your to do?" 
              value={des} 
              onChange={(e)=>{setDes(e.target.value)}}  
              />
              <div className='err-con'>
               {des.trim().length<10 ? <p className='err'>{error.des}</p>:<p>&nbsp;</p>}
               </div>
              </div>
            <button onClick={handleTask}>Add</button>
          </div>
          <div className="button">
            <button style={{background:isClicked===false&&"#7a2bdccd",color:isClicked===false&&"white"}} onClick={()=>{setIsClicked(false)}}>To do</button>
            <button style={{background:isClicked===true&&"#7a2bdccd",color:isClicked===true&&"white"}} onClick={()=>{setIsClicked(true)}}>Completed</button>
          </div>
              
             {isClicked===false && 
                
                taskItems.map((item,index)=>{
                return <div className='todoListItem'>
                <div className='items' key={index}>
                <h2>{item.title}</h2>
              <div>{item.description}</div>
              </div>
              
              <div className='icons'>
              <FiEdit className='edit-icon' onClick={()=>handleOpen(index)}/>
              <FaCheck className='check-icon' onClick={()=>handleTick(index)}/>
              <AiFillDelete className='delete-icon' onClick={()=>handleDelete(index)}/>
              <div>
              <Modal open={open} onClose={onCloseModal} center>
              <div className='modal'>
                <label htmlFor="title">Title: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </label>
                <input 
                id='title' 
                type="text" 
                placeholder="Enter title for your work?" 
                value={editTitle}
                onChange={handleEditTitle}
                /><br/>
                <label htmlFor="des">Description:</label>
                <input 
                id='des' 
                type="text" 
                placeholder="what Description of your to do?" 
                value={editDes}
                onChange={handleEditDes}
                />
              </div>
              <button className='edit-btn' onClick={handleEdit}>Edit</button>
              </Modal>
              </div>      
            </div>
            </div>
              })}
              
              {isClicked===true && 
                CompletedToDo.map((item,index)=>{
                return <div className='todoListItem'>
                <div className='items' key={index}>
                <h2>{item.title}</h2>
              <div>{item.description}</div>
              <div className='timeDate'>completed On:{item.completedOn}</div>
              </div>
              <div className='icons'>
              <FaRepeat className='repeat-icon' onClick={()=>handleRepeat(item,index)}/> 
              <AiFillDelete className='delete-icon' onClick={()=>handleCompletedToDoDelete(index)}/>  
            </div>
            </div>
              })}
        </div>
      </div>
   
   
  );
}

export default App;


/*practice/todoapp*/