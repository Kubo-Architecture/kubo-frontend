import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserIdFromToken } from '../utils/jwt';

function LoginWithGoogleButton({ onLoginSuccess }: any) {
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse: any) => {
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

            const { token } = response.data;
            localStorage.setItem('token', token);

            if (onLoginSuccess) {
                await onLoginSuccess();
            }

            const userId = getUserIdFromToken();
            if (!userId) {
                throw new Error('Não foi possível obter o userId do token');
            }

            const user = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`);

            if (user.data.nickname) {
                navigate(`/gallery`);
            } else {
                navigate(`/profile/nickname`);
            }

        } catch (error: any) {
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
        />
    );
}

export default LoginWithGoogleButton;