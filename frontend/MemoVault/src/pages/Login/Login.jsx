import { Link, useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import PassWordInput from "../../components/Input/PasswordInput";
import { useState } from "react";
import { emailSchema, passwordSchema } from '../../utils/Schema'
import AxiosInstance from "../../utils/AxiosInstance";

//login component
const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" })
    const [error, setError] = useState(null)


    const navigate = useNavigate();

    //handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    //validate form data
    const validateForm = () => {
        const emailValidation = emailSchema.safeParse(formData.email);
        const passwordValidation = passwordSchema.safeParse(formData.password)

        if (!emailValidation.success) {
            return emailValidation.error.errors[0].message;
        }

        if (!passwordValidation.success) {
            return passwordValidation.error.errors[0].message;
        }
        return null;
    }

    //handle login form submission
    const handleLogin = async (e) => {
        e.preventDefault();

        const validationError = validateForm();

        if (validationError) {
            setError(validationError)
        }
        else {
            setError(null)
        }
        //LOGIN API CALL
        try {
            const response = await AxiosInstance.post('/login', {
                email: formData.email,
                password: formData.password
            })

            if (response.data && response.data.accessToken) {
                localStorage.setItem('token', response.data.accessToken);
                navigate('/dashboard')
            }
        }
        catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message)
            }
            else {
                setError('An Unexpected error occurred')
            }
        }
    }

    return (
        <>
            <div className="flex items-center justify-between px-6 py-2 drop-shadow bg-white">
            <h1 className="text-xl font-medium text-black py-2">MemoVault</h1>
            </div>
            <div className="flex items-center justify-center mt-28">
                <div className="w-96 border rounded bg-white px-7 py-10">
                    <form onSubmit={handleLogin}>
                        <h4 className="text-2xl mb-7">Login</h4>
                        <input type="text" name="email" placeholder="Email" className="input-box" value={formData.email} onChange={handleInputChange} />
                        <PassWordInput value={formData.password} onChange={(e) => handleInputChange({ target: { name: "password", value: e.target.value } })} />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button type="submit" className="btn-primary">Login</button>
                        <p className="text-sm text-center mt-4">Not registered yet?{" "}
                            <Link to="/signup" className="font-medium text-primary underline">Create an Account</Link></p>
                    </form>
                </div>
            </div>
        </>
    )
}
export default Login;