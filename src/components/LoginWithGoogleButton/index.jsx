import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginWithGoogleButton() {
    const navigate = useNavigate();

    console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
    console.log('VITE_GOOGLE_CLIENT_ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);

    const handleSuccess = async (credentialResponse) => {
        try {
            const idToken = credentialResponse.credential;

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/google`,
                { token: idToken },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const { token, name, idUser } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('name', name);
            localStorage.setItem('idUser', idUser);

            const user = await axios.get(`${import.meta.env.VITE_API_URL}/user/${idUser}`);

            if (user.data.nickname) {
                navigate(`/profile/${user.data.nickname}`);
            } else {
                navigate(`/profile/nickname`);
            }

        } catch (error) {
            console.error('Erro no login com Google:', error);

            if (error.response?.status === 404) {
                navigate('/error/404');
            } else {
                alert('Erro ao fazer login com Google. Tente novamente.');
            }
        }
    };

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => {
                console.error('Erro no login com Google');
                alert('Falha ao fazer login com Google.');
            }}
            useOneTap={false}
            size="large"
            text="continue_with"
            shape="rectangular"
            logo_alignment="center"
            width={450}
        />
    );
}

export default LoginWithGoogleButton;