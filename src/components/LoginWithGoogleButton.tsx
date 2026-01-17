import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

            const { token, name, userId } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('name', name);
            localStorage.setItem('userId', userId);

            if (onLoginSuccess) {
                await onLoginSuccess();
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