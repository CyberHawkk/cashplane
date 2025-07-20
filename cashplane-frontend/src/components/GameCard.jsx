export default function GameCard({ title, gameUrl }) {
  return (
    <div className="p-4 border rounded">
      <h2>{title}</h2>
      <iframe src={gameUrl} width="300" height="200" title={title}></iframe>
    </div>
  );
}
