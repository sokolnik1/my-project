import React, { useContext, useState } from 'react';
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import Input from '../../components/Inputs/Input';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext';
import uploadImage from '../../utils/uploadImage';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";
    if (!fullName) {
      setError("Пожалуйста, введите свое имя.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Пожалуйста, введите корректный email.");
      return;
    }

    if (!password) {
      setError("Пожалуйста, введите пароль");
      return;
    }

    setError("");

    
    try {
      
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName, 
        email,
        password,
        profileImageUrl
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch(error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Что-то пошло не так. Попробуйте снова.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Создать аккаунт</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Заполните данные для регистрации.
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Имя и Фамилия"
              placeholder="Иван Иванов"
              type="text"
            />

            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email"
              placeholder="john@example.com"
              type="text"
            />

            <div className="col-span-2">
              <Input
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label="Пароль"
                placeholder="Не менее 8 символов"
                type="password"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary">
            ЗАРЕГИСТРИРОВАТЬСЯ
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Уже есть аккаунт?{" "}
            <Link className="font-medium text-primary underline" to="/login">
              Войти
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default SignUp;