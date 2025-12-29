import React, { useContext } from "react";

import "./Price.css";
import Context from "../../context";
import close from "../Navigation/close-fill.svg";
import download from "./download.svg";

import pdf from "./ПРАЙС_ЛИСТ от 29.12.2025.pdf";
import xlsx from "./ПРАЙС_ЛИСТ от 29.12.2025.xlsx";

export default function Price() {
  const { setShowPrice } = useContext(Context);

  function onClosePrice() {
    const body = document.getElementById("body");
    body.classList.remove("body-hidden");
    setShowPrice(false);
  }

  function wrapperClick(event) {
    // console.log(event.target, event.currentTarget)
    if (event.target === event.currentTarget) {
      onClosePrice();
    }
  }

  return (
    <>
      <div className="prices__wrapper" onClick={wrapperClick}>
        <div className="prices">
          <div className="prices__buttons">
            <a
              href={xlsx}
              target="_blank"
              rel="noopener noreferrer"
              title="Скачать xls"
              className="prices__downl"
            >
              <img src={download} alt="download" />
              <p>XLS</p>
            </a>
            <a
              href={pdf}
              target="_blank"
              rel="noopener noreferrer"
              title="Скачать pdf"
              className="prices__downl"
            >
              <img src={download} alt="download" />
              PDF
            </a>
            <div className="prices__close" onClick={onClosePrice}>
              <img src={close} alt="close" />
            </div>
          </div>
          <div className="prices__info">
            <h1 style={{ textAlign: "center", color: "var(--first-color)" }}>
              Cкидки по акции 2025
            </h1>
            <h2 style={{ textAlign: "center", color: "var(--first-color)" }}>
              Цены на опредение механических свойств снижены с 0.45 СБЦ до 0.40
              СБЦ
            </h2>            
            <h2 style={{ textAlign: "left", color: "var(--first-color)" }}>
              Скидка за предоплату:
            </h2>
            <div style={{ display: "flex", justifyContent: "space-around", columnGap: "0.25rem" }}>
              <h3 style={{ display: "flex", columnGap: "0.35rem"}}>
                100% - скидка <p style={{ color: "var(--first-color)" }}>20%</p>
              </h3>
              <h3 style={{ display: "flex", columnGap: "0.35rem"}}>
                75% - скидка <p style={{ color: "var(--first-color)" }}>15%</p>
              </h3>
              <h3 style={{ display: "flex", columnGap: "0.35rem"}}>
                50% - скидка <p style={{ color: "var(--first-color)" }}>10%</p>
              </h3>
            </div>
            <div className="">
              Примечание – Для заказчиков, впервые обращающихся в испытательную
              лабораторию АО «МОСТДОРГЕОТРЕСТ», необходима обязательная
              предоплата в размере не менее 50%.
            </div>            
          </div>
          <div className="prices__frame">
            <iframe
              width="1230px"
              height="15000px"
              frameBorder="0"
              title="table"
              src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTAg81b8uLUlcGnaWoI-7tutV_RVg33OSg_htHnoZ3DigJnJXo0MK0E6YQaVsTGJA/pubhtml?gid=870626401&amp;single=true&amp;widget=true&amp;headers=false"
            ></iframe>
          </div>

          {/* <iframe
						width="912"
						height="13900"
						frameBorder="0"
						scrolling="no"
						src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTa0kDSNY7BHq_Ibc30PJ0HHkp13J0VIZE--LR04E-4IGMH1x03y0R9YGMw9kcf6A/pubhtml?widget=true&amp;headers=false"
					></iframe> */}
        </div>
      </div>
    </>
  );
}
