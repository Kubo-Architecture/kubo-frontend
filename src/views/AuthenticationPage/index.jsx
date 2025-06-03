import { useState } from "react";
import LoginForm from "../../components/LoginPage/LoginForm/index";
import RegisterForm from "../../components/SignUp/SignUpForm/index";

export default function AuthenticationPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Formulário - lado esquerdo */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-semibold mb-2">Bem vindo de volta!</h1>
          <p className="mb-6 text-sm">
            Ainda não tem uma conta?{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:underline"
            >
              {isLogin ? "Cadastre-se" : "Entrar"}
            </button>
          </p>

          {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>

      {/* Imagem - lado direito */}
      <div className="hidden md:flex w-full md:w-1/2 items-center justify-center bg-gray-100 p-8">
        <div className="w-[300px] h-[600px] bg-cover bg-center rounded-3xl shadow-xl"
          style={{ backgroundImage: "url('/img/imagem-kubo.png')" }}
        >
          <div className="flex flex-col justify-between h-full p-4 text-white">
            <span className="text-sm font-bold">Kubo</span>
            <span className="text-lg font-semibold">Explore do seu jeito</span>
          </div>
        </div>
      </div>
    </div>
  );
}
