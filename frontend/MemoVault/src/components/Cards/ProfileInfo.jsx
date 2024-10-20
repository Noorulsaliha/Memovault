import getInitials from '../../utils/Initial'

const ProfileInfo = ({onLogout, userInfo}) => {

    return(
        <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-200 w-12 h-12 text-slate-950 justify-center rounded-full font-medium">{getInitials(userInfo?.fullname || "G")}</div>
            <div>
                <p className="text-sm font-medium">{userInfo?.fullname || "Guest User"}</p>
                <button className="text-sm underline text-slate-700" onClick={onLogout}>Logout</button>
            </div>
        </div>
    )
}

export default ProfileInfo