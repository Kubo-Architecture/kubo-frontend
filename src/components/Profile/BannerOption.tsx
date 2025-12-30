export default function BannerOption({ background, selected, onSelect }: any) {
  return (
    <div
      className={`relative h-[150px] w-[300px] rounded-[10px] cursor-pointer overflow-hidden border-2 transition-all duration-200 hover:scale-[1.02] ${selected ? 'border-blue-600' : 'border-transparent'
        }`}
      onClick={() => onSelect(background)}
    >
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url(${background})`,
        }}
      />

      <div className="absolute top-2 left-2 z-10">
        <input
          type="radio"
          checked={selected}
          onChange={() => onSelect(background)}
          className="h-5 w-5 text-blue-600"
        />
      </div>
    </div>
  );
}
