import KinoboxPlayer from "../Pages/Anime.tsx";
import "../css/anime.css";

function Player() {
  return (
    <div>
      <div className="pla-box">
        <h3></h3>
        <div className="pla">
          <KinoboxPlayer kpId="444" />
        </div>
      </div>
    </div>
  );
}
export default Player;
