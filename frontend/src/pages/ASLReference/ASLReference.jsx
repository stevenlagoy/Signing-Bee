import styles from "./ASLReference.module.scss";
import WebcamSample from "../../components/Camera/Camera";

const images = [
  { src: "/asl-alphabet-svgs/Sign_language_A.svg.png", label: "A" },
  { src: "/asl-alphabet-svgs/Sign_language_B.svg.png", label: "B" },
  { src: "/asl-alphabet-svgs/Sign_language_C.svg.png", label: "C" },
  { src: "/asl-alphabet-svgs/Sign_language_D.svg.png", label: "D" },
  { src: "/asl-alphabet-svgs/Sign_language_E.svg.png", label: "E" },
  { src: "/asl-alphabet-svgs/Sign_language_F.svg.png", label: "F" },
  { src: "/asl-alphabet-svgs/Sign_language_G.svg.png", label: "G" },
  { src: "/asl-alphabet-svgs/Sign_language_H.svg.png", label: "H" },
  { src: "/asl-alphabet-svgs/Sign_language_I.svg.png", label: "I" },
  { src: "/asl-alphabet-svgs/Sign_language_J.svg.png", label: "J" },
  { src: "/asl-alphabet-svgs/Sign_language_K.svg.png", label: "K" },
  { src: "/asl-alphabet-svgs/Sign_language_L.svg.png", label: "L" },
  { src: "/asl-alphabet-svgs/Sign_language_M.svg.png", label: "M" },
  { src: "/asl-alphabet-svgs/Sign_language_N.svg.png", label: "N" },
  { src: "/asl-alphabet-svgs/Sign_language_O.svg.png", label: "O" },
  { src: "/asl-alphabet-svgs/Sign_language_P.svg.png", label: "P" },
  { src: "/asl-alphabet-svgs/Sign_language_Q.svg.png", label: "Q" },
  { src: "/asl-alphabet-svgs/Sign_language_R.svg.png", label: "R" },
  { src: "/asl-alphabet-svgs/Sign_language_S.svg.png", label: "S" },
  { src: "/asl-alphabet-svgs/Sign_language_T.svg.png", label: "T" },
  { src: "/asl-alphabet-svgs/Sign_language_U.svg.png", label: "U" },
  { src: "/asl-alphabet-svgs/Sign_language_V.svg.png", label: "V" },
  { src: "/asl-alphabet-svgs/Sign_language_W.svg.png", label: "W" },
  { src: "/asl-alphabet-svgs/Sign_language_X.svg.png", label: "X" },
  { src: "/asl-alphabet-svgs/Sign_language_Y.svg.png", label: "Y" },
  { src: "/asl-alphabet-svgs/Sign_language_Z.svg.png", label: "Z" },
];

export default function ASLReference() {
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
  );
}