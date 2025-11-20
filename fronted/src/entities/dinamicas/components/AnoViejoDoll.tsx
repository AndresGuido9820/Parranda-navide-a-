import { animate } from 'animejs';
import React, { useEffect, useRef } from 'react';
import type { AnoViejoState } from '../types/anoViejo.types';

interface AnoViejoDollProps {
  state: AnoViejoState;
}

export const AnoViejoDoll: React.FC<AnoViejoDollProps> = ({ state }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.burnStatus === 'quemando' && wrapperRef.current) {
      animate(wrapperRef.current, {
        scale: [1, 1.02, 0.98, 1.01, 0.99, 1],
        rotate: [0, 2, -2, 1, -1, 0],
        duration: 4000,
        easing: 'easeInOutSine',
        loop: true
      });
    }
  }, [state.burnStatus]);

  const isBurned = state.burnStatus === 'quemado';
  const isBurning = state.burnStatus === 'quemando';

  // Colores dinámicos según la ropa seleccionada
  const camisaColor = state.partes.camisa?.color || '#fcee64';
  const pantalonesColor = state.partes.pantalones?.color || '#cc224c';
  const zapatosColor = state.partes.zapatos?.color || '#b4dffc';
  const zapatosTipo = state.partes.zapatos?.id;
  const sombreroStyle = state.partes.sombrero;

  // Renderizar sombrero según el tipo
  const renderSombrero = () => {
    if (!sombreroStyle || sombreroStyle.id === 'ninguno') return null;

    switch (sombreroStyle.id) {
      case 'navideno':
        return (
          <div className="gorro-navideno" style={{
            position: 'absolute',
            top: '-45px',
            left: '58px',
            transform: 'rotate(45deg)',
            transformOrigin: 'center center',
            zIndex: 10,
            width: '120px',
            height: '120px',
           
          }}>
            <style>{`
              .gorro-navideno {
                position: relative;
              }
              .gorro-navideno .cuerpo {
                width: 0;
                height: 0;
                border-left: 50px solid transparent;
                border-right: 50px solid transparent;
                border-bottom: 80px solid #de2f32;
                position: relative;
              }
              .gorro-navideno .base {
                width: 110px;
                height: 25px;
                background: #fff;
                border-radius: 25px;
                position: absolute;
                top: 75px;
                left: -3px;
                border: 2px solid #000;
                z-index: 2;
              }
              .gorro-navideno .bola {
                width: 25px;
                height: 25px;
                background: #fff;
                border-radius: 50%;
                position: absolute;
                top: -15px;
                left: 39px;
                border: 2px solid #000;
                z-index: 3;
              }
            `}</style>
            <div className="cuerpo"></div>
            <div className="base"></div>
            <div className="bola"></div>
          </div>
        );
      case 'vueltiao':
        return (
          <div className="sombrero-mexicano" style={{
            position: 'absolute',
            top: '-68px',
            left: '46px',
            transform: 'rotate(45deg)',
            transformOrigin: 'center center',
            zIndex: 10,
            width: '150px',
            height: '120px',
           
          }}>
            <style>{`
              .sombrero-mexicano {
                position: relative;
                width: 100%;
                height: 100%;
              }
              .sombrero-mexicano .back {
                position: absolute;
                top: 0;
                left: 30%;
                width: 40%;
                height: 90%;
                background: linear-gradient(#f8ad2d 40%, #cd4132 40%, #cd4132 45%, #536e2e 45%, #536e2e 50%, #f8ad2d 50%);
                border-radius: 50% 50% 0 0 / 60% 60% 0 0;
                border: 2px solid #000;
              }
              .sombrero-mexicano .front {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 35%;
                background: linear-gradient(#e79d2d 15%, #f8ad2d 15%, #f8ad2d 25%, #cd4132 25%, #cd4132 33%, #f8ad2d 33%, #f8ad2d 90%, #e79d2d 90%);
                border-radius: 10% 10% 20% 20% / 10% 10% 90% 90%;
                border: 2px solid #000;
              }
            `}</style>
            <div className="back"></div>
            <div className="front"></div>
          </div>
        );
      case 'sombrero-svg':
        return (
          <div className="sombrero-svg" style={{
            position: 'absolute',
            top: '-20px',
            left: '3px',
            transform: 'rotate(45deg)',
            transformOrigin: 'center center',
            zIndex: 10,
            width: '150px',
            height: '120px',
           
          }}>
            <style>{`
              .sombrero-svg {
                position: relative;
                
    
              }
              .sombrero-svg .parte-superior {
                position: absolute;
                top: 0;
                left: 10%;
                width: 80%;
                height: 33%;
                background: #2E2E2E;
                border: 2px solid #000;
              }
              .sombrero-svg .banda-roja {
                position: absolute;
                top: 33%;
                left: 10%;
                width: 80%;
                height: 8%;
                background: #FF4040;
                border: 2px solid #000;
              }
              .sombrero-svg .banda-negra {
                position: absolute;
                top: 41%;
                left: 0;
                width: 100%;
                height: 4%;
                background: #2E2E2E;
                border: 2px solid #000;
                border-radius: 2px;
              }
              
            `}</style>
            <div className="parte-superior"></div>
            <div className="banda-roja"></div>
            <div className="banda-negra"></div>
         
            
          </div>
        );
      case 'one-piece':
        return (
          <div className="sombrero-one-piece" style={{
            position: 'absolute',
            top: '-20px',
            left: '3px',
            transform: 'rotate(45deg)',
            transformOrigin: 'center center',
            zIndex: 10,
            width: '150px',
            height: '120px',
          }}>
            <style>{`
              .sombrero-one-piece {
                position: relative;
              }
              .sombrero-one-piece .copa {
                position: absolute;
                top: 0;
                left: 15%;
                width: 70%;
                height: 50%;
                background: #FFD020;
                border: 2px solid #000;
                border-radius: 50% 50% 0 0;
                box-shadow: inset 0 -10px 0 rgba(0,0,0,0.1);
              }
              .sombrero-one-piece .cinta {
                position: absolute;
                top: 40%;
                left: 10%;
                width: 80%;
                height: 12%;
                background: #FF0012;
                border: 2px solid #000;
                border-radius: 20px;
                z-index: 2;
              }
              .sombrero-one-piece .ala {
                position: absolute;
                top: 50%;
                left: 0;
                width: 100%;
                height: 8%;
                background: #FFD020;
                border: 2px solid #000;
                border-radius: 50%;
                z-index: 1;
              }
              .sombrero-one-piece .ala:before {
                content: '';
                position: absolute;
                top: -5px;
                left: 10%;
                width: 80%;
                height: 15px;
                background: #FFD020;
                border: 2px solid #000;
                border-top: none;
                border-radius: 0 0 50% 50%;
              }
            `}</style>
            <div className="copa"></div>
            <div className="cinta"></div>
            <div className="ala"></div>
          </div>
        );
      case 'elf-hat':
        return (
          <div className="elf-hat" style={{
            position: 'absolute',
            top: '-100px',
            left: '44px',
            transform: 'rotate(45deg)',
            transformOrigin: 'center center',
            zIndex: 10,
            width: '192px',
            height: '160px',
            
          }}>
            <style>{`
              .elf-hat {
                position: relative;
                width: 12rem;
                height: 10rem;
              }
              .elf-hat__main {
                width: 9rem;
                height: 10rem;
                overflow: hidden;
                position: absolute;
                left: 1.5rem;
              }
              .elf-hat__main::before {
                content: '';
                display: block;
                width: 12rem;
                height: 20rem;
                background: #bf0603;
                border-radius: 50% 50% 50% 50% / 80% 20% 50% 0;
              }
              .elf-hat__main::after {
                content: '';
                display: block;
                position: absolute;
                z-index: 2;
                top: 0.7rem;
                left: 8rem;
                width: 4rem;
                height: 12rem;
                background-color: #2b0a0a;
                border-radius: 50% 50% 20% 50% / 10% 10% 50% 0%;
                transform: rotate(-20deg);
              }
              
              .elf-hat__side {
                position: absolute;
                z-index: 4;
                top: 6.5rem;
                left: 0;
              }
              .elf-hat__side::after {
                content: '';
                display: block;
                width: 9rem;
                height: 1rem;
                background-color: #7cb518;
                position: absolute;
                top: 3rem;
                left: 1.5rem;
                border-radius: 0 0 50% 50%;
              }
              .elf-hat__side__left {
                position: absolute;
                width: 4rem;
                height: 3.5rem;
                overflow: hidden;
                
              }
              .elf-hat__side__left::before {
                position: absolute;
                content: '';
                display: block;
                width: 8rem;
                height: 8rem;
                margin-left: -4rem;
                border-radius: 50%;
                background-color: #7cb518;
              }
              .elf-hat__side__left::after {
                position: absolute;
                z-index: 2;
                content: '';
                display: block;
                width: 3rem;
                height: 6rem;
                margin-left: -1.5rem;
                border-radius: 50% 50% 0 0;
                background-color: #2b0a0a;
              }
              .elf-hat__side__right {
                position: absolute;
                width: 4rem;
                height: 3.5rem;
                left: 8rem;
                overflow: hidden;
              }
              .elf-hat__side__right::before {
                position: absolute;
                content: '';
                display: block;
                width: 8rem;
                height: 8rem;
                border-radius: 50%;
                background-color: #7cb518;
              }
              .elf-hat__side__right::after {
                position: absolute;
                z-index: 2;
                content: '';
                display: block;
                width: 3rem;
                height: 6rem;
                margin-left: 2.5rem;
                border-radius: 50% 50% 0 0;
                background-color: #2b0a0a;
              }
              .elf-hat__side__spikes {
                position: absolute;
                width: 8rem;
                height: 4.5rem;
                top: -1rem;
                left: 2rem;
                overflow: hidden;
              }
              .elf-hat__side__spikes::before,
              .elf-hat__side__spikes::after {
                content: '';
                display: block;
                position: absolute;
                top: 1.5rem;
                width: 5rem;
                height: 5rem;
                background-color: #7cb518;
                transform: scaleX(0.7) rotate(45deg);
              }
              .elf-hat__side__spikes::after {
                left: 3rem;
                top: 2rem;
              }
              .elf-hat__gold {
                position: absolute;
                z-index: 5;
                width: 1.4rem;
                height: 1.4rem;
                border-radius: 50%;
                background-color: #fec601;
              }
              .elf-hat__gold--main {
                left: 10rem;
              }
              .elf-hat__gold--left {
                left: -0.3rem;
                top: 5.8rem;
              }
              .elf-hat__gold--left-center {
                left: 3.75rem;
                top: 5.1rem;
              }
              .elf-hat__gold--right-center {
                left: 6.75rem;
                top: 5.6rem;
              }
              .elf-hat__gold--right {
                left: 10.7rem;
                top: 5.8rem;
              }
            `}</style>
            <div className="elf-hat__main">
    
            </div>
            <div className="elf-hat__side">
              <div className="elf-hat__side__left"></div>
              <div className="elf-hat__side__right"></div>
              <div className="elf-hat__side__spikes"></div>
            </div>
            <div className="elf-hat__gold elf-hat__gold--main"></div>
            <div className="elf-hat__gold elf-hat__gold--left"></div>
            <div className="elf-hat__gold elf-hat__gold--left-center"></div>
            <div className="elf-hat__gold elf-hat__gold--right-center"></div>
            <div className="elf-hat__gold elf-hat__gold--right"></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={`wrapper transition-all duration-300 ${
        isBurned ? 'opacity-30 grayscale' : ''
      } ${isBurning ? '' : ''}`}
      id="stewie"
    >
      <style>{`
        body, html {
          width: 100%;
          height: 100%;
          margin: 0;
        }

        .wrapper {
          position: relative;
          width: 210px;
          height: 210px;
          left: 50%;
          top: 50%;
          margin-left: -105px;
          margin-top: -105px;
          transform: scale(1);
        }

        @media (max-width: 640px) {
          .wrapper {
            width: 160px;
            height: 160px;
            margin-left: -80px;
            margin-top: -80px;
            transform: scale(0.76);
          }
        }

        @media (max-width: 480px) {
          .wrapper {
            width: 140px;
            height: 140px;
            margin-left: -70px;
            margin-top: -70px;
            transform: scale(0.67);
          }
        }

        .head {
          width: 120px;
          height: 120px;
          background-color: antiquewhite;
          border-bottom-left-radius: 140px;
          border-bottom-right-radius: 10px;
          border-top-right-radius: 120px;
          border-top-left-radius: 25px;
          transform: rotate(-53deg);
          position: absolute;
          left: 50px;
          border: 2px solid #000;
          z-index: 5;
        }

        .hair-wrapper {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .hair1 { width: 10px; height: 17px; border-top: 2px solid #000; border-top-right-radius: 13px; position: absolute; top: -3px; left: 16px; transform: rotate(25deg); }
        .hair2 { width: 10px; height: 17px; border-top: 2px solid #000; border-top-right-radius: 13px; position: absolute; top: -3px; left: 31px; transform: rotate(36deg); }
        .hair3 { width: 14px; height: 17px; border-top: 2px solid #000; border-top-right-radius: 10px; position: absolute; top: 0px; left: 43px; transform: rotate(58deg); }
        .hair4 { width: 18px; height: 23px; border-top: 2px solid #000; border-top-right-radius: 14px; position: absolute; top: 5px; left: 55px; transform: rotate(64deg); }
        .hair5 { width: 18px; height: 23px; border-top: 2px solid #000; border-top-right-radius: 16px; position: absolute; top: 15px; left: 71px; transform: rotate(71deg); }
        .hair6 { width: 13px; height: 23px; border-top: 2px solid #000; border-top-right-radius: 16px; position: absolute; top: 29px; left: 89px; transform: rotate(80deg); }
        .hair7 { width: 13px; height: 23px; border-top: 2px solid #000; border-top-right-radius: 16px; position: absolute; top: 46px; left: 98px; transform: rotate(88deg); }
        .hair8 { width: 13px; height: 23px; border-top: 2px solid #000; border-top-right-radius: 16px; position: absolute; top: 66px; left: 104px; transform: rotate(93deg); }
        .hair9 { width: 10px; height: 23px; border-top: 2px solid #000; border-top-right-radius: 16px; position: absolute; top: 84px; left: 106px; transform: rotate(99deg); }

        .ear#left {
          width: 16px;
          height: 13px;
          background-color: antiquewhite;
          border-bottom-left-radius: 20px;
          border-bottom-right-radius: 20px;
          border-top-right-radius: 36px;
          border-top-left-radius: 40px;
          transform: rotate(-44deg);
          position: absolute;
          left: -6px;
          top: -5px;
          border: 2px solid #000;
          border-bottom-style: none;
          z-index: 2;
        }

        .ear#left .ear-inside {
          width: 8px;
          height: 17px;
          border-top: 2px solid #000;
          border-top-left-radius: 7px;
          position: absolute;
          top: 2px;
          left: 0px;
          transform: rotate(37deg);
        }

        .ear#right {
          width: 16px;
          height: 17px;
          background-color: antiquewhite;
          border-bottom-left-radius: 60px;
          border-bottom-right-radius: 45px;
          border-top-right-radius: 50px;
          border-top-left-radius: 40px;
          transform: rotate(-100deg);
          position: absolute;
          left: 182px;
          top: 42px;
          border: 2px solid #000;
          border-top-style: none;
          z-index: -1;
        }

        .ear-cover {
          width: 13px;
          height: 16px;
          background-color: antiquewhite;
          border-bottom-left-radius: 45px;
          border-bottom-right-radius: 50px;
          border-top-right-radius: 0px;
          border-top-left-radius: 0px;
          transform: rotate(-48deg);
          position: absolute;
          left: 108px;
          top: 108px;
          z-index: 2;
        }

        .ear-cover .ear-inside {
          width: 6px;
          height: 17px;
          border-top: 2px solid #000;
          border-top-right-radius: 7px;
          position: absolute;
          top: 6px;
          left: -1px;
          transform: rotate(46deg);
        }

        .eye#left {
          width: 29px;
          height: 27px;
          background-color: white;
          border-bottom-left-radius: 60px;
          border-bottom-right-radius: 60px;
          border-top-right-radius: 60px;
          border-top-left-radius: 60px;
          border: 2px solid;
          transform: rotate(-48deg);
          position: absolute;
          left: 15px;
          top: 25px;
          z-index: 2;
          overflow: hidden;
        }

        .eye#right {
          width: 29px;
          height: 26px;
          background-color: white;
          border-bottom-left-radius: 60px;
          border-bottom-right-radius: 60px;
          border-top-right-radius: 60px;
          border-top-left-radius: 60px;
          border: 2px solid;
          transform: rotate(-228deg);
          position: absolute;
          left: 67px;
          top: 77px;
          z-index: 2;
          overflow: hidden;
        }

        .eye#left .eyeball { width: 4px; height: 4px; background-color: black; border-radius: 3px; position: absolute; left: 10px; top: 13px; z-index: 3; }
        .eye#right .eyeball { width: 4px; height: 4px; background-color: black; border-radius: 3px; position: absolute; left: 14px; top: 13px; z-index: 3; }

        .eye#left .eyelid#lower { width: 25px; height: 1px; border-top: 2px solid; transform: rotate(96deg); position: absolute; left: -7px; top: 11px; z-index: 3; transition: all 200ms ease; }
        .eye#left .eyelid#lower:after { content: ""; width: 25px; height: 25px; background-color: antiquewhite; position: absolute; left: 0px; top: 0px; z-index: 3; }
        .eye#left .eyelid#upper { width: 25px; height: 1px; border-top: 2px solid; transform: rotate(110deg); position: absolute; left: 9px; top: 14px; z-index: 3; transition: all 200ms ease; }
        .eye#left .eyelid#upper:after { content: ""; width: 25px; height: 25px; background-color: antiquewhite; position: absolute; left: 0px; bottom: 3px; z-index: 3; }

        .eye#right .eyelid#lower { width: 25px; height: 1px; border-top: 2px solid; transform: rotate(84deg); position: absolute; left: 10px; top: 11px; z-index: 3; transition: all 200ms ease; }
        .eye#right .eyelid#lower:after { content: ""; width: 25px; height: 25px; background-color: antiquewhite; position: absolute; left: 0px; bottom: 3px; z-index: 3; }
        .eye#right .eyelid#upper { width: 25px; height: 1px; border-top: 2px solid; transform: rotate(69deg); position: absolute; left: -5px; top: 13px; z-index: 3; transition: all 200ms ease; }
        .eye#right .eyelid#upper:after { content: ""; width: 25px; height: 25px; background-color: antiquewhite; position: absolute; left: 0px; top: 0px; z-index: 3; }

        .eyebrow#left { width: 22px; height: 1px; border-top: 2px solid; transform: rotate(64deg); position: absolute; left: 36px; top: 23px; z-index: 3; transition: all 200ms ease; }
        .eyebrow#right { width: 22px; height: 1px; border-top: 2px solid; transform: rotate(16deg); position: absolute; left: 85px; top: 73px; z-index: 3; transition: all 200ms ease; }

        .nose { width: 7px; height: 11px; background-color: transparent; border-right: 2px solid #000; border-bottom: 2px solid #000; position: absolute; left: 53px; top: 70px; z-index: 3; }

        .mouth { position: absolute; }
        .mouth-line { width: 17px; height: 17px; border-top: 2px solid #000; border-top-left-radius: 20px 4px; position: absolute; top: 81px; left: 27px; transform: rotate(44deg); transition: all 200ms ease; }
        .upper-lip { width: 8px; height: 17px; border-top: 2px solid #000; border-top-left-radius: 7px; position: absolute; top: 80px; left: 49px; transform: rotate(-60deg); }
        .lower-lip { width: 6px; height: 17px; border-top: 2px solid #000; border-top-left-radius: 7px; position: absolute; top: 85px; left: 35px; transform: rotate(20deg); }

        .shirt#left {
          position: absolute;
          width: 70px;
          height: 70px;
          background-color: ${camisaColor};
          border: 2px solid #000;
          top: 73px;
          left: 67px;
          border-top-left-radius: 70px;
          border-bottom: none;
          border-right: none;
        }

        .shirt#right {
          position: absolute;
          width: 72px;
          height: 70px;
          background-color: ${camisaColor};
          border: 2px solid #000;
          top: 70px;
          left: 80px;
          transform: rotate(-10deg);
          border-top-right-radius: 115px 90px;
          border-bottom-right-radius: 13px;
          border-left: none;
          z-index: -1;
        }

        .tummy {
          position: absolute;
          width: 32px;
          height: 5px;
          border-top: 2px solid #000;
          top: 120px;
          left: 129px;
          border-top-right-radius: 40px 10px;
          transform: rotate(75deg);
          z-index: 5;
        }

        .arm-left {
          position: absolute;
          width: 26px;
          height: 17px;
          border-top: 2px solid #000;
          top: 125px;
          left: 65px;
          border-right: 2px solid;
          transform: rotate(100deg);
          border-top-right-radius: 5px 9px;
          border-bottom-right-radius: 8px 5px;
          z-index: 5;
          background-color: ${camisaColor};
          border-bottom-left-radius: 19px;
        }

        .overalls-main {
          position: absolute;
          width: 62px;
          height: 63px;
          background-color: ${pantalonesColor};
          top: 120px;
          left: 86px;
        }

        .overalls-strap-left {
          position: absolute;
          width: 12px;
          height: 21px;
          border-right: 2px solid #000;
          border-top-right-radius: 100px;
          background-color: ${pantalonesColor};
          top: 100px;
          left: 93px;
          z-index: 1;
        }

        .overalls-strap-right {
          position: absolute;
          width: 26px;
          height: 15px;
          border-top: 2px solid;
          border-top-right-radius: 27px 14px;
          border-bottom-right-radius: 0px;
          background-color: ${pantalonesColor};
          transform: rotate(72deg);
          top: 104px;
          left: 121px;
        }

        .overalls-neck {
          position: absolute;
          width: 26px;
          height: 21px;
          background-color: ${camisaColor};
          border: 2px solid #000;
          top: 103px;
          left: 106px;
          transform: rotate(-6deg);
          border-left: none;
          border-top: none;
          border-bottom-right-radius: 6px;
          border-top-right-radius: 4px;
          z-index: 0;
        }

        .button-right {
          width: 10px;
          height: 10px;
          border-radius: 10px;
          border: 2px solid #000;
          position: absolute;
          top: 116px;
          left: 128px;
          z-index: 6;
          background-color: #FCFEA7;
        }

        .button-left {
          width: 10px;
          height: 10px;
          border-radius: 10px;
          border: 2px solid #000;
          position: absolute;
          top: 120px;
          left: 95px;
          z-index: 6;
          background-color: #FCFEA7;
        }

        .overalls-strap-left-cover {
          width: 40px;
          height: 26px;
          border-top: 2px solid #000;
          border-right: 2px solid #000;
          border-top-right-radius: 16px;
          border-bottom-left-radius: 28px;
          position: absolute;
          top: 105px;
          left: 65px;
          background-color: ${camisaColor};
          transform: rotate(79deg);
          z-index: 2;
        }

        .overalls-side-right {
          width: 7px;
          height: 15px;
          border-bottom: 2px solid #000;
          border-left: 2px solid #000;
          border-bottom-left-radius: 17px;
          position: absolute;
          top: 118px;
          left: 139px;
          background-color: ${camisaColor};
          z-index: 2;
        }

        .bok {
          width: 60px;
          height: 60px;
          border-radius: 40px;
          border-bottom: 2px solid #000;
          border-left: 2px solid #000;
          position: absolute;
          top: 109px;
          left: 72px;
          z-index: -1;
          background-color: ${pantalonesColor};
        }

        .leg-left {
          width: 10px;
          height: 27px;
          border-left: 2px solid #000;
          border-bottom-left-radius: 7px;
          background-color: ${pantalonesColor};
          position: absolute;
          top: 160px;
          left: 80px;
          transform: rotate(3deg);
        }

        .leg-left-bottom {
          width: 38px;
          height: 5px;
          border-bottom: 2px solid #000;
          border-bottom-right-radius: 30px;
          border-bottom-left-radius: 30px;
          background-color: ${pantalonesColor};
          position: absolute;
          top: 181px;
          left: 82px;
          transform: rotate(-3deg);
          z-index: 7;
        }

        .leg-middle {
          width: 10px;
          height: 30px;
          border-right: 2px solid #000;
          border-bottom-right-radius: 7px;
          background-color: ${pantalonesColor};
          position: absolute;
          top: 157px;
          left: 110px;
          transform: rotate(-1deg);
          z-index: 6;
        }

        .leg-right {
          width: 10px;
          height: 48px;
          border-right: 2px solid #000;
          border-bottom-right-radius: 7px 44px;
          background-color: ${pantalonesColor};
          position: absolute;
          top: 135px;
          left: 140px;
          transform: rotate(-5deg);
        }

        .leg-right-bottom {
          width: 30px;
          height: 5px;
          border-bottom: 2px solid #000;
          border-bottom-right-radius: 45px 30px;
          border-bottom-left-radius: 30px 20px;
          background-color: ${pantalonesColor};
          position: absolute;
          top: 179px;
          left: 120px;
          transform: rotate(-3deg);
        }

        .shoe-right {
          width: 45px;
          height: 20px;
          position: absolute;
          top: 180px;
          left: 118px;
          border: 2px solid #000;
          z-index: 8;
          border-top-right-radius: 25px;
          border-bottom-right-radius: 25px 10px;
          border-bottom-left-radius: 35px 12px;
          background-color: ${zapatosColor};
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        ${zapatosTipo === 'rojos' ? `
        .shoe-right::before {
          content: '';
          position: absolute;
          top: 3px;
          left: 6px;
          width: 10px;
          height: 8px;
          border: 1px solid rgba(0,0,0,0.4);
          border-radius: 2px;
          background: rgba(255,255,255,0.1);
        }
        .shoe-right::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 3px;
          background: #1a1a1a;
          border-radius: 0 0 25px 10px;
          border-top: 1px solid #000;
        }
        ` : ''}
        ${zapatosTipo === 'marrones' ? `
        .shoe-right::before {
          content: '';
          position: absolute;
          top: 1px;
          left: 12px;
          width: 6px;
          height: 14px;
          border-left: 2px solid rgba(0,0,0,0.5);
          border-right: 2px solid rgba(0,0,0,0.5);
        }
        .shoe-right::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: -1px;
          width: calc(100% + 2px);
          height: 5px;
          background: #2C1810;
          border-radius: 0 0 25px 10px;
          border: 2px solid #000;
          border-top: none;
        }
        ` : ''}
        ${zapatosTipo === 'cafe' ? `
        .shoe-right::before {
          content: '';
          position: absolute;
          top: 2px;
          left: 8px;
          width: 2px;
          height: 10px;
          background: rgba(0,0,0,0.6);
          border-radius: 1px;
        }
        .shoe-right::after {
          content: '';
          position: absolute;
          top: 2px;
          right: 8px;
          width: 2px;
          height: 10px;
          background: rgba(0,0,0,0.6);
          border-radius: 1px;
        }
        ` : ''}

        .shoe-left {
          width: 48px;
          height: 24px;
          position: absolute;
          top: 178px;
          left: 72px;
          border: 2px solid #000;
          z-index: 8;
          border-top-left-radius: 35px 25px;
          border-bottom-left-radius: 15px 8px;
          border-bottom-right-radius: 35px 12px;
          background-color: ${zapatosColor};
          transform: rotate(-5deg);
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        ${zapatosTipo === 'rojos' ? `
        .shoe-left::before {
          content: '';
          position: absolute;
          top: 4px;
          left: 8px;
          width: 12px;
          height: 10px;
          border: 1px solid rgba(0,0,0,0.4);
          border-radius: 2px;
          background: rgba(255,255,255,0.1);
        }
        .shoe-left::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 3px;
          background: #1a1a1a;
          border-radius: 0 0 15px 35px;
          border-top: 1px solid #000;
        }
        ` : ''}
        ${zapatosTipo === 'marrones' ? `
        .shoe-left::before {
          content: '';
          position: absolute;
          top: 2px;
          left: 14px;
          width: 8px;
          height: 16px;
          border-left: 2px solid rgba(0,0,0,0.5);
          border-right: 2px solid rgba(0,0,0,0.5);
        }
        .shoe-left::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: -1px;
          width: calc(100% + 2px);
          height: 5px;
          background: #2C1810;
          border-radius: 0 0 15px 35px;
          border: 2px solid #000;
          border-top: none;
        }
        ` : ''}
        ${zapatosTipo === 'cafe' ? `
        .shoe-left::before {
          content: '';
          position: absolute;
          top: 3px;
          left: 10px;
          width: 2px;
          height: 12px;
          background: rgba(0,0,0,0.6);
          border-radius: 1px;
        }
        .shoe-left::after {
          content: '';
          position: absolute;
          top: 3px;
          right: 10px;
          width: 2px;
          height: 12px;
          background: rgba(0,0,0,0.6);
          border-radius: 1px;
        }
        ` : ''}

        .hand-left .palm { width: 9px; height: 8px; position: absolute; left: 75px; top: 145px; background-color: antiquewhite; }
        .hand-left .finger1 { width: 5px; height: 6px; position: absolute; left: 68px; top: 145px; background-color: antiquewhite; border: 2px solid #000; border-top: none; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; }
        .hand-left .finger2 { width: 4px; height: 7px; position: absolute; left: 72px; top: 149px; background-color: antiquewhite; border: 2px solid #000; border-top: none; border-bottom-left-radius: 10px 27px; }
        .hand-left .finger3 { width: 4px; height: 7px; position: absolute; left: 76px; top: 151px; background-color: antiquewhite; border: 2px solid #000; border-top: none; border-bottom-left-radius: 10px 27px; border-bottom-right-radius: 12px; }
        .hand-left .finger4 { width: 5px; height: 4px; position: absolute; left: 80px; top: 148px; background-color: antiquewhite; border: 2px solid #000; border-top: none; border-bottom-left-radius: 6px 5px; border-bottom-right-radius: 8px 9px; transform: rotate(-50deg); }

        .hand-right .finger1 { width: 5px; height: 6px; position: absolute; left: 145px; top: 138px; background-color: antiquewhite; border: 2px solid #000; border-top: none; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; z-index: -2; }
        .hand-right .finger2 { width: 4px; height: 13px; position: absolute; left: 151px; top: 130px; background-color: antiquewhite; border: 2px solid #000; border-top: none; border-bottom-left-radius: 10px 27px; border-bottom-right-radius: 12px; z-index: -2; transform: rotate(-10deg); }

        /* HOVER EFFECTS */
        .wrapper:hover .eye#left .eyelid#upper { width: 31px; left: 0px; }
        .wrapper:hover .eye#left .eyelid#lower { left: -5px; }
        .wrapper:hover .eye#right .eyelid#upper { width: 30px; left: -4px; }
        .wrapper:hover .eye#right .eyelid#lower { left: 8px; }
        .wrapper:hover .eyebrow#left { left: 36px; top: 28px; }
        .wrapper:hover .eyebrow#right { left: 81px; top: 74px; }
        .wrapper:hover .mouth-line { border-top-left-radius: 14px 7px; }
        .wrapper:hover .head { top: 3px; }
        .wrapper:hover .ear#right { top: 45px; }
      `}</style>

      <div className="wrapper" id="stewie">
        <div className="head">
          {renderSombrero()}
          <div className="hair-wrapper">
            <div className="hair1"></div>
            <div className="hair2"></div>
            <div className="hair3"></div>
            <div className="hair4"></div>
            <div className="hair5"></div>
            <div className="hair6"></div>
            <div className="hair7"></div>
            <div className="hair8"></div>
            <div className="hair9"></div>
          </div>
          <div className="ear" id="left"><div className="ear-inside"></div></div>
          <div className="ear-cover"><div className="ear-inside"></div></div>
          <div className="eyebrow" id="left"></div>
          <div className="eyebrow" id="right"></div>
          <div className="eye" id="left">
            <div className="eyeball" id="eyeball-left"></div>
            <div className="eyelid" id="lower"></div>
            <div className="eyelid" id="upper"></div>
          </div>
          <div className="eye" id="right">
            <div className="eyeball" id="eyeball-right"></div>
            <div className="eyelid" id="lower"></div>
            <div className="eyelid" id="upper"></div>
          </div>
          <div className="nose"></div>
          <div className="mouth">
            <div className="upper-lip"></div>
            <div className="mouth-line"></div>
            <div className="lower-lip"></div>
          </div>
          {renderSombrero()}
        </div>
        
        <div className="ear" id="right"></div>
        
        <div className="body">
          <div className="shirt" id="left"></div>
          <div className="shirt" id="right"></div>
          <div className="tummy"></div>
          <div className="arm-left"></div>
          <div className="overalls-main"></div>
          <div className="overalls-strap-left"></div>
          <div className="overalls-strap-left-cover"></div>
          <div className="overalls-strap-right"></div>
          <div className="overalls-side-right"></div>
          <div className="overalls-neck"></div>
          <div className="button-left"></div>
          <div className="button-right"></div>
          <div className="bok"></div>
          <div className="leg-left"></div>
          <div className="leg-left-bottom"></div>
          <div className="leg-middle"></div>
          <div className="leg-right"></div>
          <div className="leg-right-bottom"></div>
          <div className="shoe-right"></div>
          <div className="shoe-left"></div>
          <div className="hand-right">
            <div className="finger1"></div>
            <div className="finger2"></div>
          </div>
          <div className="hand-left">
            <div className="finger1"></div>
            <div className="finger2"></div>
            <div className="finger3"></div>
            <div className="palm"></div>
            <div className="finger4"></div>
          </div>
        </div>

        {/* Accesorios renderizados de forma especial */}
        {state.partes.accesorios && state.partes.accesorios.id !== 'ninguno' && (
          <>
            {state.partes.accesorios.id === 'gafas' && (
              <div style={{
                position: 'absolute',
                top: '50px',
                left: '80px',
                transform: 'rotate(-15deg)',
                width: '100px',
                height: '25px',
                zIndex: 20,
              }}>
                <div style={{
                  position: 'absolute',
                  width: '35px',
                  height: '30px',
                  border: '3px solid #000',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  left: '-20px',
                  top: '-10px',
                }}></div>
                <div style={{
                  position: 'absolute',
                  width: '50px',
                  height: '3px',
                  backgroundColor: '#000',
                  top: '8px',
                  left: '10px',
                }}></div>
                <div style={{
                  position: 'absolute',
                  width: '35px',
                  height: '30px',
                  border: '3px solid #000',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  left: '55px',
                  top: '0px',
                }}></div>
              </div>
            )}
            {state.partes.accesorios.id === 'gafas-negras' && (
              <div style={{
                position: 'absolute',
                top: '50px',
                left: '80px',
                transform: 'rotate(-15deg)',
                width: '100px',
                height: '25px',
                zIndex: 20,
              
              }}>
                <div style={{
                  position: 'absolute',
                  width: '35px',
                  height: '30px',
                  border: '3px solid #000',
                  borderRadius: '50%',
                  backgroundColor: '#000',
                  left: '-20px',
                  top: '-10px',
                }}></div>
                <div style={{
                  position: 'absolute',
                  width: '50px',
                  height: '3px',
                  backgroundColor: '#000',
                  top: '8px',
                  left: '10px',
                }}></div>
                <div style={{
                  position: 'absolute',
                  width: '35px',
                  height: '30px',
                  border: '3px solid #000',
                  borderRadius: '50%',
                  backgroundColor: '#000',
                  left: '55px',
                  top: '0px',
                }}></div>
              </div>
            )}
            {state.partes.accesorios.id === 'barba' && (
              <div style={{
                position: 'absolute',
                top: '78px',
                left: '128px',
                transform: 'translateX(-50%)',
                zIndex: 20,
              }}>
                <style>{`
                  .barba-beard {
                height: 12px;
                width: 36px;
                background: #f5c0a1;
                border: 6px solid #773300;
                border-top-width: 12px;
                border-bottom-width: 22px;
                border-radius: 40% 40% 45% 45%;
                margin-left: -24px;
                position: relative;
              }
              .barba-beard:before {
                content: "";
                height: 4px;
                width: 20px;
                border: 6px solid transparent;
                border-top: 1px solid #000;
                border-bottom: 12px solid #773300;
                margin-left: -16px;
                top: 1px;
                left: 50%;
                position: absolute;
              }
                `}</style>
                <div className="barba-beard"></div>
              </div>
            )}
            {state.partes.accesorios.id === 'reloj' && (
              <>
                {/* Correa del reloj */}
                <div style={{
                  position: 'absolute',
                  top: '135px',
                  left: '63px',
                  width: '18px',
                  height: '8px',
                  backgroundColor: '#8B4513',
                  border: '1px solid #000',
                  transform: 'rotate(5deg)',
                  zIndex: 21,
                }}></div>
                {/* Reloj */}
                <div style={{
                  position: 'absolute',
                  top: '130px',
                  left: '65px',
                  width: '20px',
                  height: '20px',
                  backgroundColor: state.partes.accesorios.color,
                  border: '2px solid #000',
                  borderRadius: '50%',
                  zIndex: 22,
                }}>
                  {/* Esfera del reloj */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '12px',
                    height: '12px',
                    border: '1px solid #000',
                    borderRadius: '50%',
                    backgroundColor: '#FFF',
                    transform: 'translate(-50%, -50%)',
                  }}>
                    {/* Manecillas */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '1px',
                      height: '5px',
                      backgroundColor: '#000',
                      transform: 'translate(-50%, -100%)',
                      transformOrigin: 'bottom',
                    }}></div>
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '1px',
                      height: '4px',
                      backgroundColor: '#000',
                      transform: 'translate(-50%, -100%) rotate(90deg)',
                      transformOrigin: 'bottom',
                    }}></div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};