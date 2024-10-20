import { useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import PassWordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { emailSchema, passwordSchema, nameSchema } from "../../utils/Schema";
import AxiosInstance from "../../utils/AxiosInstance";


const SignUp = () => {
    const [formData, setFormData] = useState({name : "", email : "", password : ""})
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleInputchange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name] : value}))
    }

    const validateFormData = () => {
        const emailValidation = emailSchema.safeParse(formData.email)
        const nameValidation = nameSchema.safeParse(formData.name)
        const passwordValidation = passwordSchema.safeParse(formData.password)

        if(!nameValidation.success){
            return nameValidation.error.errors[0].message
        }
        if(!emailValidation.success){
            return emailValidation.error.errors[0].message
        }       
        if(!passwordValidation.success){
            return passwordValidation.error.errors[0].message
        }
        return null;
    }

    const handleSignUp = async (e) => {
        e.preventDefault();

        const validationError = validateFormData();

        if(validationError){
            setError(validationError)
            return
        }
        else{
            setError("");
        }

        try{
            const response = await AxiosInstance.post('/create-account', {
                fullname : formData.name,
                email : formData.email,
                password : formData.password
            })

            if(response.data && response.data.accessToken){
                localStorage.setItem('token', response.data.accessToken);
                navigate('/dashboard')
            }
        }
        catch(error){
            if(error.response && error.response.data && error.response.data.message){
                setError(error.response.data.message)
            }
            else {
                setError("An error occurred while signing up")
            }
        }
    }
    return (
        <>
        <div className="flex items-center justify-between px-6 py-2 drop-shadow bg-white">
            <h1 className="text-xl font-medium text-black py-2">MemoVault</h1>
            </div>
        <div className="flex items-center justify-center mt-28">
            <div className="w-96 border rounded px-7 py-10 bg-white">
                <form onSubmit={handleSignUp}>
                    <h4 className="text-2xl mb-7">Sign Up</h4>
                    <input type="text" name="name" value={formData.name} placeholder="Name" className="input-box" onChange={handleInputchange}/>
                    <input type="text" name="email" value={formData.email} placeholder="Email" className="input-box" onChange={handleInputchange}/>
                    <PassWordInput value={formData.password} onChange={(e) => handleInputchange({target : {name : "password" , value : e.target.value}})}/>
                    {error && <p className="text-red-600 text-xs pb-1">{error}</p>}
                    <button type="submit" className="btn-primary">Signup</button>
                    <p className="text-sm text-center mt-4">Already an user? {" "}
                        <Link to="/login" className="font-medium text-primary underline">Login</Link>
                    </p>
                </form>
            </div>
        </div>
        </>
    )
}
export default SignUp;