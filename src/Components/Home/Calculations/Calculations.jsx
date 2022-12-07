import React from "react";

import "./Calculations.css";

import welcome from "./расчёты.png";

export default function Calculations() {
  return (
    <>
      <div className="home-calculations" id="Calculations">
        <div className="home-blur"></div>
        <div className="calculations__content">
          <div className="calculations__main">
            <div className="calculations__main-title">
              <h1 className="calculations__main-title_main">Расчеты</h1>
              <div className="calculations__main-title_sub">
                В нашей лаборатории проводятся геотехнические расчеты грунтовых
                сооружений, таких как насыпи, откосы, грунтовые дамбы и др.,
                методом конечных элементов с использованием нелинейных моделей
                грунтов, и аналитическими методами. Также в лаборатории
                проводится проектирование средств инженерной защиты (грунтовые
                стенки, анкерные системы, геосинтетические конструкции и др.).
              </div>
              <div className="main_title_img calculations_title_img">
                <img src={welcome} alt="Calculations" />
              </div>
              <button className="main-title_btn" onClick={() => {}}>
                Посмотреть цены
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
