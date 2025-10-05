import LoginForm from "../components/LoginForm";
import loginSVG from '../assets/undraw_friendly-guy-avatar_dqp5.svg';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-violet-200 grid grid-cols-1 md:grid-cols-2">
      <section className="bg-violet-300 hidden md:flex flex-col items-center justify-center p-6">
        <img src={loginSVG} alt="Login Illustration" className="w-3/4 max-w-md mb-6" />
        <h2 className="text-3xl font-bold text-gray-800 font-serif">Welcome back</h2>
      </section>

      <section className="bg-slate-100 flex flex-col items-center justify-center p-6">
        <div className="flex items-center justify-center p-3 border-b border-gray-100">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-3 rounded-xl text-xl font-bold shadow-lg">
            AA
          </div>
          <h1 className="font-bold text-2xl text-gray-800 ml-3">genda</h1>
        </div>

        <h1 className="font-medium text-lg p-3 font-serif text-center">
          <span>Please make sure to verify your email before login</span>
        </h1>

        <LoginForm />
      </section>
    </div>
  );
}