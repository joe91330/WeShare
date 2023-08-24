// hooks/useSignUp.js
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";


const useSignUp = () => {
  const [error, setError] = useState(null);
  // const { logIn } = useLogIn();

  const signUp = async (name, phone, password, setIsRegisterPage) => {
    // console.log('sign')
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/signup`,
        {
          name,
          phone,
          password,
        }
      );

      //   console.log("註冊成功", response.data);
      if (response.status === 200) {
        // logIn(email, password); // cancel this feature
        setIsRegisterPage(false);
        // 顯示 SweetAlert 彈出視窗
        Swal.fire({
          title: "註冊成功",
          text: "恭喜您已成功註冊帳號！",
          icon: "success",
          confirmButtonText: "確定",
        });
      }

      // 清除錯誤訊息
      setError(null);
    } catch (err) {
      //   setError(err.response.data.message || "註冊失敗");
    }
  };

  return { signUp, error };
};

export default useSignUp;
