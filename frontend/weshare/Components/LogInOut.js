"use client";

import "../src/app/globals.css";
import { useState } from "react";
import Image from "next/image";
import styles from "../styles/logInOut.module.scss";
import useLogIn from "../hooks/useLogin";
import useSignUp from "../hooks/useSingUp";

export default function LogInOut() {
  // const router = useRouter();
  // const { data: userData, error: userError } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/users`);

  const [isRegisterPage, setIsRegisterPage] = useState(false);
  const handleTogglePage = () => {
    // 切換註冊/登入頁面
    setIsRegisterPage((prev) => !prev);
  };

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");

  const { signUp, error: signUpError } = useSignUp();
  const { logIn, error } = useLogIn();

  const handleSignUp = (e) => {
    e.preventDefault();
    if (password !== passwordAgain) {
      alert("兩次密碼不一致，請檢查！");
    } else signUp(name, phone, password, setIsRegisterPage);
  };

  const handleLogIn = (e) => {
    e.preventDefault();
    logIn(phone, password);
  };

  return (
    <div className={styles.border}>
      <div>
        <div id={styles.signInUp}>
          <div className={styles.weshare}>We Share</div>
          {isRegisterPage ? (
            <div className={styles.memRL}>會員註冊</div>
          ) : (
            <div className={styles.memRL}>會員登入</div>
          )}
          <div className={styles.textAndInput}>
            {isRegisterPage && (
              <div className={styles.iconAndInput}>
                <Image
                  src="/user_profle_icon.png"
                  width={30}
                  height={30}
                  alt="Example"
                  className={styles.icon}
                />
                <input
                  type="text"
                  name="name"
                  value={name}
                  placeholder="例: Chou Chou Hu"
                  className={styles.inputFrame}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
          </div>
          <div className={styles.textAndInput}>
            <div className={styles.iconAndInput}>
              <Image
                src="/smartphone.png"
                width={30}
                height={30}
                alt="Example"
                className={styles.icon}
              />
              <input
                type="text"
                name="email"
                placeholder="例: 0912-345-678"
                value={phone}
                className={styles.inputFrame}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.textAndInput}>
            <div className={styles.iconAndInput}>
              <Image
                src="/lock.png"
                width={30}
                height={30}
                alt="Example"
                className={styles.icon}
              />
              <input
                type="password"
                name="password"
                placeholder="密碼"
                value={password}
                className={styles.inputFrame}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.textAndInput}>
            {isRegisterPage && (
              <div className={styles.iconAndInput}>
                <Image
                  src="/key_icon.png"
                  width={30}
                  height={30}
                  alt="Example"
                  className={styles.icon}
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="再次輸入密碼"
                  value={passwordAgain}
                  className={styles.inputFrame}
                  onChange={(e) => setPasswordAgain(e.target.value)}
                />
              </div>
            )}
            {signUpError && <p className="errorMessage">{signUpError}</p>}
            {error && <p className="errorMessage">{error}</p>}
          </div>
          {!isRegisterPage ? (
            <button
              type="button"
              className={styles.register}
              onClick={handleLogIn}
            >
              登入
            </button>
          ) : (
            <button
              type="button"
              className={styles.register}
              onClick={handleSignUp}
            >
              註冊
            </button>
          )}

          {isRegisterPage ? (
            <div className={styles.blackBlueWords}>
              <div>已經是會員了？ </div>
              <button
                type="button"
                className={styles.swichmode}
                onClick={handleTogglePage}
              >
                會員登入
              </button>
            </div>
          ) : (
            <div className={styles.blackBlueWords}>
              <div>尚未成為會員？</div>
              <button
                type="button"
                className={styles.swichmode}
                onClick={handleTogglePage}
              >
                會員註冊
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
