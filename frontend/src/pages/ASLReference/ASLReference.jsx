import styles from "./ASLReference.module.scss"
import WebcamSample from "../../components/Camera/Camera";
import A from "../../assets/asl-alphabet-svgs/Sign_language_A.svg.png";
import B from "../../assets/asl-alphabet-svgs/Sign_language_B.svg.png";
import C from "../../assets/asl-alphabet-svgs/Sign_language_C.svg.png";
import D from "../../assets/asl-alphabet-svgs/Sign_language_D.svg.png";
import E from "../../assets/asl-alphabet-svgs/Sign_language_E.svg.png";
import F from "../../assets/asl-alphabet-svgs/Sign_language_F.svg.png";
import G from "../../assets/asl-alphabet-svgs/Sign_language_G.svg.png";
import H from "../../assets/asl-alphabet-svgs/Sign_language_H.svg.png";
import I from "../../assets/asl-alphabet-svgs/Sign_language_I.svg.png";
import J from "../../assets/asl-alphabet-svgs/Sign_language_J.svg.png";
import K from "../../assets/asl-alphabet-svgs/Sign_language_K.svg.png";
import L from "../../assets/asl-alphabet-svgs/Sign_language_L.svg.png";
import M from "../../assets/asl-alphabet-svgs/Sign_language_M.svg.png";
import N from "../../assets/asl-alphabet-svgs/Sign_language_N.svg.png";
import O from "../../assets/asl-alphabet-svgs/Sign_language_O.svg.png";
import P from "../../assets/asl-alphabet-svgs/Sign_language_P.svg.png";
import Q from "../../assets/asl-alphabet-svgs/Sign_language_Q.svg.png";
import R from "../../assets/asl-alphabet-svgs/Sign_language_R.svg.png";
import S from "../../assets/asl-alphabet-svgs/Sign_language_S.svg.png";
import T from "../../assets/asl-alphabet-svgs/Sign_language_T.svg.png";
import U from "../../assets/asl-alphabet-svgs/Sign_language_U.svg.png";
import V from "../../assets/asl-alphabet-svgs/Sign_language_V.svg.png";
import W from "../../assets/asl-alphabet-svgs/Sign_language_W.svg.png";
import X from "../../assets/asl-alphabet-svgs/Sign_language_X.svg.png";
import Y from "../../assets/asl-alphabet-svgs/Sign_language_Y.svg.png";
import Z from "../../assets/asl-alphabet-svgs/Sign_language_Z.svg.png";

export default function ASLReference() {
  const images = [
    { src: A, label: "A" },
    { src: B, label: "B" },
    { src: C, label: "C" },
    { src: D, label: "D" },
    { src: E, label: "E" },
    { src: F, label: "F" },
    { src: G, label: "G" },
    { src: H, label: "H" },
    { src: I, label: "I" },
    { src: J, label: "J" },
    { src: K, label: "K" },
    { src: L, label: "L" },
    { src: M, label: "M" },
    { src: N, label: "N" },
    { src: O, label: "O" },
    { src: P, label: "P" },
    { src: Q, label: "Q" },
    { src: R, label: "R" },
    { src: S, label: "S" },
    { src: T, label: "T" },
    { src: U, label: "U" },
    { src: V, label: "V" },
    { src: W, label: "W" },
    { src: X, label: "X" },
    { src: Y, label: "Y" },
    { src: Z, label: "Z" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.grid}>
          {images.map((img, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.cardFrame}>
                <img className={styles.hand} src={img.src} alt={img.label} />
              </div>
              <p className={styles.caption}>{img.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.camera}>
          <WebcamSample />
        </div>
      </div>
    </div>
  )
}