import React, { useContext } from "react";

import "./Price.css";
import Context from "../../context";
import close from "../Navigation/close-fill.svg";
import download from "./download.svg";

import pdf from "./ПРАЙС-ЛИСТ от 16.07.2025.pdf";
import xlsx from "./ПРАЙС-ЛИСТ от 16.07.2025.xlsx";

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
              Дополнительная скидка 15%:
            </h2>
            <div className="">
              Предоставляется в случае передачи заказчиком полной ведомости
              физических свойств грунтов в формате испытательной лаборатории
              МДГТ или в формате ИНЖГЕО с разбивкой по ИГЭ и стратиграфическими
              индексами, заверенной печатью и подписью руководителя организации
              заказчика. К ведомости физических свойств должна прилагаться
              поверочная ведомость на используемое оборудование. Предложение
              действует для организаций, имеющих в своём составе аккредитованную
              геологическую лабораторию, предоставляющую образцы грунта для
              определения механических свойств грунтов. АО «МОСТДОРГЕОТРЕСТ»
              оставляет за собой право выборочной проверки точности определения
              физических свойств грунтов, предоставляемых заказчиком.
            </div>
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
              src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSFo_hXxtzY4fUqQgC1_HMLPTsVcHfW5sGCqwrCWT0BKU_slIT6qkCiByisAEPOqg/pubhtml?gid=1272536876&amp;single=true&amp;widget=true&amp;headers=false"
            ></iframe>
          </div>

          {/* <iframe
						width="912"
						height="13900"
						frameBorder="0"
						scrolling="no"
						src="https://onedrive.live.com/embed?resid=F8FDB7ADA61C95BE%2149818&amp;authkey=%21AFTlMM83_Zrl-As&amp;em=2&amp;wdAllowInteractivity=False&amp;Item='%D0%9B%D0%B8%D1%81%D1%821'!A1%3AG336&amp;wdDownloadButton=True&amp;wdInConfigurator=True&amp;wdInConfigurator=True&amp;edesNext=false&amp;ejss=false"
					></iframe> */}
        </div>
      </div>
    </>
  );
}
