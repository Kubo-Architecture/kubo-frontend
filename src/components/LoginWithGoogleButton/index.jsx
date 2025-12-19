import { GoogleLogin } from '@react-oauth/google'
import axios from 'axios'

function LoginWithGoogleButton() {
    const handleSuccess = async (credentialResponse) => {
        const idToken = credentialResponse.credential

        const response = await axios.post(
            'http://localhost:8080/auth/google',
            { token: idToken }
        )

        localStorage.setItem('token', response.data.token)
    }

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => console.log('Erro no login')}
        />
    )
}

export default LoginWithGoogleButton