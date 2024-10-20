import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from 'react-router-dom'
import Searchbar from "../Cards/Searchbar";
import { useState } from "react";

const NavBar = ({userInfo, OnSearchMemo,handleClearSearch}) => {
    const [searchQuery, setSearchQuery] = useState("")
    const navigate = useNavigate();

    const onLogout = () => {
        navigate("/login")
    }

    const handleSearch = () => {
        if(searchQuery){
            OnSearchMemo(searchQuery)
        }
    }
    const onClearSearch = () => {
        setSearchQuery("")
        handleClearSearch()
    }
    return(
        <div className="flex items-center justify-between px-6 py-2 drop-shadow bg-white">
            <h1 className="text-xl font-medium text-black py-2">MemoVault</h1>
            <Searchbar value={searchQuery} onChange={(e) => {
                setSearchQuery(e.target.value)
            }} handleSearch={handleSearch} onClearSearch={onClearSearch}/>
            <ProfileInfo onLogout={onLogout} userInfo={userInfo}/>
        </div>
    )
}

export default NavBar;