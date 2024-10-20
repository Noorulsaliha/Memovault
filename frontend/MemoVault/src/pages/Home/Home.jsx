import { MdAdd } from 'react-icons/md';
import NoteCard from '../../components/Cards/NoteCard';
import  NavBar  from '../../components/NavBar/NavBar'
import AddEditNotes from './AddEditNotes';
import { useEffect, useState } from 'react';
import Modal from 'react-modal'
import { useNavigate, useSearchParams } from 'react-router-dom';
import AxiosInstance from '../../utils/AxiosInstance';
import Toast from '../../components/ToastMessage/Toast';
import EmptyCard from '../../components/EmptyCard/EmptyCard';
import addMemo from '../../../SVG/addMemo.svg'
import Draggable from 'react-draggable'
import NoData from '../../../SVG/NoData.svg'

const Home = () => {
    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown : false,
        type : "add",
        data : null
    })
    const [showToast, setShowToast] = useState({
        isShown : false,
        message : "",
        type : "add"
    })

    const [memos, setAllMemos] = useState([])
    const [userInfo, setUserInfo] = useState(null)
    const [isSearch, setIsSearch] = useState(false)
    const navigate = useNavigate();
    

    const handleEdit = (noteDetails) => {
        setOpenAddEditModal({
            isShown : true,
            type : "edit",
            data : noteDetails
        })
    }

    //get-user info
    const getUserInfo = async() => {
        try {
            const response = await AxiosInstance.get('/get-user');
            if(response.data && response.data.user){
                setUserInfo(response.data.user);
            }
        }
        catch(error){
            if(error.response.status === 401){
                localStorage.clear();
                navigate('/login');
            }
        }
    }
    //get-all-notes
    const getAllMemos = async () => {
        try {
            const response = await AxiosInstance.get('/get-all-memos');

            if(response.data && response.data.memos){
                setAllMemos(response.data.memos);
            }
        }catch(error){
            console.log("An Unexpected error Occured, Please try again later!");
        }
    }
    //handle Toast
    const showToastMessage = (message, type) => {
        setShowToast({
            isShown : true,
            message,
            type
        })
    }

    const handleToastClose = () => {
        setShowToast({
            isShown : false,
            message : ""
        })
    }

    //delete note
    const deleteNote = async (data) => {
        const memoId = data._id
        try {
        const response = await AxiosInstance.delete('/delete-memo/' + memoId)
            if(response.data){
                showToastMessage("Memo Deleted Successfully", 'delete')
                getAllMemos()
            }
        }catch(error){
            if(error.response && error.response.data && error.response.data.message){
            console.log("An Unexpected error Occured, Please try again later!");
            }
        }
    }

    //search note
    const OnSearchMemo = async (query) => {
        try {
            const response = await AxiosInstance.get('/search-memo', {
                params : {query}
            })
            if(response.data && response.data.message){
                setIsSearch(true)
                setAllMemos(response.data.memos)
        }
        }
        catch(error){
            console.log("An Unexpected error Occured, Please try again later!");
        }
    }
    //handle clear search
    const handleClearSearch = () => {
        setIsSearch(false)
        getAllMemos()
    }

    const updateIsPinned = async (memo) => {
        const memoId = memo._id;
        try {
            const response = await AxiosInstance.put('/update-memo-ispinned/' + memoId, {
                isPinned : !memo.isPinned
            })

            if(response.data && response.data.message){
                showToastMessage("Note Updated Successfully"),
                setAllMemos((prevMemos) => {
                    const updatedMemos = prevMemos.map((item) => 
                    item._id === memoId ? {...item, isPinned : !item.isPinned} : item
                    )
                    return updatedMemos
                })
                getAllMemos()
            }
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        getUserInfo();
        getAllMemos();
        return () => {} //cleanup function
    },[])

    
    return (
        <div className='relative'>
        <NavBar userInfo={userInfo} OnSearchMemo={OnSearchMemo} handleClearSearch={handleClearSearch}/>
        <div className='container mx-auto px-4 lg:px-8 xl:px-16 md:my-8 py-4'>
            {memos.length > 0 ? <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mt-8'>
                {memos.map((item) => (
                    <NoteCard 
                    key={item._id}
                    title={item.title} 
                    date={item.createdOn} 
                    content={item.content}
                    tags={item.tags}
                    isPinned={item.isPinned}
                    onEdit={() => handleEdit(item)}
                    onDelete={() => deleteNote(item)}
                    onPinNote={() => updateIsPinned(item)}
                />
                ))}
            </div> : <EmptyCard imgSrc={isSearch ? NoData : addMemo} message={
                <div>
                {isSearch ? (
                    <>
                    "No memos match your search. Try a different {<span className='font-medium text-primary'>keyword</span>} or {<span className='font-medium text-primary'>create a new memo</span>} to keep your productive ideas alive!"
                    </>
                    ) :(
                    <>
                    "Be Productive! Hit the {<span className='font-medium text-primary'>+</span>} to Make Your First Memo!"
                    </>
                    )}
                </div>
            }/>}
        </div>
        
        <Draggable>
        <button className='bg-primary z-50 w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-blue-600 absolute md:right-16 md:bottom-0 right-4 bottom-4' 
        onClick={() => {
                setOpenAddEditModal({
                    isShown : true,
                    type : "add",
                    data : null
                })
        }}
        >
            <MdAdd className='text-[32px] text-white'/>
        </button>
        </Draggable>

        <Modal 
        isOpen = {openAddEditModal.isShown}
        onRequestClose = {() => {
            setOpenAddEditModal({
                isShown: false,
                type: 'add',
                data: null
            });
        }}
        style = {{
            overlay : { 
                backgroundColor : 'rgba(0,0,0,0.2)',
                zIndex : 10,
                display : 'flex',
                alignItems : 'flex-start',
                justifyContent : 'center'
            }
        }}
        contentLabel = ""
        className = "w-[80%] md:w-[40%] bg-white rounded-md mx-auto mt-20 p-5"
        >

        <AddEditNotes 
        type={openAddEditModal.type}
        memoData={openAddEditModal.data}
        onClose={() => {
            setOpenAddEditModal({
                isShown : false,
                type : 'add',
                data : null
            })
        }} getAllMemos = {getAllMemos}
        showToastMessage= {showToastMessage}
        />
        </Modal>

        <Toast 
        isShown = {showToast.isShown}
        message = {showToast.message}
        type = {showToast.type}
        onClose = {handleToastClose}
        ></Toast>
        </div>
    )
}
export default Home;