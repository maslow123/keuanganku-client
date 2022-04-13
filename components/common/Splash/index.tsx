import { useAuth } from "context/auth";
import Image from "next/image";
import React from "react";
import { images } from "@util/images";
import s from './Splash.module.css';

export default function Splash() {
  const ctx = useAuth();    
  const [showModal, setShowModal] = React.useState(true);
  return (
    <>
      {showModal ? (
        <>
          <div
            className={s.wrapper}
          >
            <div className={s.container}>
              {/*content*/}
              <div className={s.content}>
                {/*body*/}
                <div className={s.contentWrapper}>
                  <div className={s.image}>
                    <Image                      
                      alt="register"
                      src={images.splash}
                      layout="intrinsic"
                      quality={100}
                      width={600}
                      height={600}                      
                    />
                    <div className={s.text}>
                      <label className={s.textTitle}>
                        Yuk atur <span className="text-white tracking-widest">Keuanganmu</span> agar kamu mendapatkan kebebasan finansial di masa depan
                      </label>
                    </div>
                  </div>
                </div>
                {/*footer*/}
                <div className={s.footer}>                  
                  <button
                    className={s.footerButton}
                    type="button"
                    onClick={() => {
                      ctx.setSplashScreen(true);
                      setShowModal(false);
                    }}
                  >
                    Lanjut ke halaman login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}