import React, { useEffect } from "react";

import "./Contacts.css";

export default function Contacts() {
  function map(e, t) {
    var r = document.getElementById(e);

    r.contentWindow.document.open();
    r.contentWindow.document.write(atob(t));
    r.contentWindow.document.close();
  }

//   useEffect(() => {
//     map(
//       "map_19137333",
//       "eJw1kM1ugzAQhN_FPQZFy58N3CLSplQEkV6qtMqBhi115GBkjFoS5d27AdUna7717IyvTJsaDdYb1Ge0RmLPko8rs2OHLGFPWNnBIHNYZ3SHxk6csLTqzgnU2B-N7KzULQnl82oB-XbIivQIuXht6pRDnu_69KeBfbkbxqCBl9Os79evclxdtnTPT499VmwK2NNskXrZehfl_mpBC45aaUPWD1CJL_gk5ZK1Nf6yxIX_c3NYMxcYp3hz-lLL1k4OVFK2lZ3K-WLJQxDCd8JwGfHAjb0DvZc1S7gIbweHnauu1L2cK12ZqixL5lkecgg83_MBuMPUnU92XhRHbuzzOACX8ml9pnSCXOlvtFJv34jqfVKtGfD2B5eQcjg"
//     );
//   }, []);

  return (
    <>
      <div className="home-contacts" id="contacts">
        <div className="contacts-info">
          <h1 className="contacts-info__title">
            Акционерное
            <br />
            общество
            <br />
            «МОСТДОРГЕОТРЕСТ»
          </h1>
          <div className="contacts-info__contact">
            <a
              href="tel:+74956566910"
              target="_blank"
              rel="noreferrer"
              className="info__contact-item"
            >
              +7(495) 656 69 10
            </a>
            <a
              href="tel:+74956566580"
              target="_blank"
              rel="noreferrer"
              className="info__contact-item"
            >
              +7(495) 656 65 80
            </a>
            <a
              href="tel:+74956566859"
              target="_blank"
              rel="noreferrer"
              className="info__contact-item"
            >
              +7(495) 656 68 59
            </a>
            <a
              href="mailto:mostdorgeotrest@mail.ru"
              target="_blank"
              rel="noreferrer"
              className="info__contact-item"
            >
              mostdorgeotrest@mail.ru
            </a>
            <a
              href="mailto:mail@mdgt.ru"
              target="_blank"
              rel="noreferrer"
              className="info__contact-item"
            >
              mail@mdgt.ru
            </a>
          </div>
          <div className="contacts-info__adress">Пн-Пт 10:00-18:00</div>
          <div className="contacts-info__adress">
            г. Москва, ул. Искры, д. 31, к. 1, этаж 4
          </div>
          <div className="contacts-info__adress">ИНН 7716750744</div>
          <div className="contacts-info__adress">ОГРН 1137746653021</div>
        </div>

        <iframe
          id="map_492814938"
          frameborder="0"
          width="100%"
          height="600px"
          src="https://makemap.2gis.ru/widget?data=eJw1kFFvgjAUhf9L9ygxF6Gt483g5liQoC8LW3xgcsdqKiWlZEPjf98Vsj4157s995xembEVWqw2aM7orMKORR9X5oYWWcSesXS9Reax1poWrRs5YeX0nROosDta1TplGhLyl9UM0m2fZPERUrmvq1hAmu66-KeGIt_1Q1jD62nSi_VeDavLlu7p6alLsk0GBc1m8SJZ75ZpsJrRgqPRxpL1A5TyCz5JuSRNhb8s8uH_3DxWTwWGMd6UPjeqcaMDlVRN6cZygZwLDlIGHufzpQj9x8WB3quKRULy28Fj57LNTaemSlemS8eiaTbgHHwJEIIvPKbv_G4XSr4MQlhILgXpF2POlE6QK_2N0frtG1G_j6qzPd7-AJWscjE"
          sandbox="allow-modals allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
        ></iframe>
      </div>
    </>
  );
}
{
  /* <iframe id="map_19137333" frameborder="0" width="100%" height="600px" src="https://makemap.2gis.ru/widget?data=" sandbox="allow-modals allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"></iframe> */
}
